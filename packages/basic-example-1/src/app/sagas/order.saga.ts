import { CommandMessageFactory, EventMessage, EventMessageFactory, TelegraphContext } from '@telegraph/core';
import { EventPayloadAssociationResolver, SagaDefinition } from '@telegraph/sagas';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { OrderShippedEvent } from '../events/order-shipped.event';
import { OrderDeliveredEvent } from '../events/order-delivered.event';
import { OrderCanceledEvent } from '../events/order-canceled.event';
import { OrderPaidEvent } from '../events/order-paid.event';

export interface OrderSagaState {
  paid: boolean;
  shipped: boolean;
  delivered: boolean;
  canceled: boolean;
}

export const orderSagaDefinition: SagaDefinition<OrderSagaState> = {
  sagaId: 'OrderSaga',
  initialState: {
    paid: false,
    shipped: false,
    delivered: false,
    canceled: false,
  },
  handlers: [
    {
      eventName: 'OrderPlacedEvent',
      sagaStart: true,
      sagaEnd: false,
      associationResolver: new EventPayloadAssociationResolver<OrderPaidEvent>('orderId'),
      callback: async (event: EventMessage<OrderPlacedEvent>) => {
        const { orderId, total, customerName } = event.payload;

        await TelegraphContext.commandBus.dispatch(
          CommandMessageFactory.create(
            'PayOrderCommand',
            { orderId: event.payload.orderId, total: event.payload.total },
            {}
          )
        );
      },
    },
    {
      eventName: 'OrderPaidEvent',
      sagaStart: false,
      sagaEnd: false,
      associationResolver: new EventPayloadAssociationResolver<OrderPaidEvent>('orderId'),
      callback: async (event: EventMessage<OrderPaidEvent>, state: OrderSagaState) => {
        state.paid = true;

        await TelegraphContext.commandBus.dispatch(
          CommandMessageFactory.create(
            'ShipOrderCommand',
            { orderId: event.payload.orderId, total: event.payload.total },
            {}
          )
        );
      },
    },
    {
      eventName: 'OrderShippedEvent',
      sagaStart: false,
      sagaEnd: false,
      associationResolver: new EventPayloadAssociationResolver<OrderShippedEvent>('orderId'),
      callback: async (event: EventMessage<OrderShippedEvent>, state: OrderSagaState) => {
        const { orderId, customerName, address } = event.payload;

        state.shipped = true;

        await new Promise<void>((resolve) =>
          setTimeout(async () => {
            await TelegraphContext.eventBus.dispatch(
              EventMessageFactory.create('OrderDeliveredEvent', { orderId, address })
            );

            resolve();
          }, 1000)
        );
      },
    },
    {
      eventName: 'OrderDeliveredEvent',
      sagaStart: false,
      sagaEnd: true,
      associationResolver: new EventPayloadAssociationResolver<OrderDeliveredEvent>('orderId'),
      callback: async (event: EventMessage<OrderDeliveredEvent>, state: OrderSagaState) => {
        const { orderId, address } = event.payload;
        state.delivered = true;
        console.log('Order delivered');
      },
    },
    {
      eventName: 'OrderCanceledEvent',
      sagaStart: false,
      sagaEnd: true,
      associationResolver: new EventPayloadAssociationResolver<OrderCanceledEvent>('orderId'),
      callback: async (event: EventMessage<OrderCanceledEvent>, state: OrderSagaState) => {
        const { orderId, reason } = event.payload;
        state.canceled = true;
        console.log('Order canceled, reason: ' + reason);
      },
    },
  ],
};

// import { Saga, SagaState, SagaEventHandler, SagaBase, SagaStart, SagaEnd } from '@telegraph/nestjs';
//
//
// // OrderCreated
// // OrderPaid / OrderPaymentFailed
// // OrderShipped / Timeout ?
// // OrderDelivered
//
// @Saga()
// class OrderSaga extends SagaBase<OrderSagaState> {
//   @SagaState()
//   public readonly state: OrderSagaState = {
//     paid: false,
//     shipped: false,
//     delivered: false,
//     canceled: false,
//   };
//
//   @SagaStart()
//   @SagaEventHandler('OrderCreatedEvent', { associationProperty: 'orderId' })
//   public async handleOrderCreated(event: OrderCreatedEvent) {
//     await this.commandBus.dispatch(new CreateInvoiceCommand(event.orderId));
//
//     throw new Error('Not implemented');
//   }
//
//   @SagaEventHandler('OrderPaidEvent', { associationProperty: 'orderId' })
//   public async handleOrderPaid(event: OrderShippedEvent) {
//     this.state.paid = true;
//     await this.commandBus.dispatch(new ShipOrderCommand(event.orderId));
//   }
//
//   @SagaEventHandler('OrderShippedEvent', { associationProperty: 'orderId' })
//   public async handleOrderShipped(event: OrderShippedEvent) {
//     this.state.shipped = true;
//   }
//
//   @SagaEnd()
//   @SagaEventHandler('OrderCancelledEvent', { associationProperty: 'orderId' })
//   public async handleOrderCancelled(event: OrderCancelledEvent) {
//     throw new Error('Not implemented');
//   }
//
//   @SagaEnd()
//   @SagaEventHandler('OrderDeliveredEvent', { associationProperty: 'orderId' })
//   public handleOrderCompleted(event: OrderCompletedEvent) {
//     this.state.delivered = true;
//   }
// }
