import { Saga, SagaState, SagaEventHandler, SagaBase, SagaStart, SagaEnd } from '@telegraph/nestjs';

export interface OrderSagaState {
  paid: boolean;
  shipped: boolean;
  delivered: boolean;
  canceled: boolean;
}

// OrderCreated
// OrderPaid / OrderPaymentFailed
// OrderShipped / Timeout ?
// OrderDelivered

@Saga()
class OrderSaga extends SagaBase<OrderSagaState> {
  @SagaState()
  public readonly state: OrderSagaState = {
    paid: false,
    shipped: false,
    delivered: false,
    canceled: false,
  };

  @SagaStart()
  @SagaEventHandler('OrderCreatedEvent', { associationProperty: 'orderId' })
  public async handleOrderCreated(event: OrderCreatedEvent) {
    await this.commandBus.dispatch(new CreateInvoiceCommand(event.orderId));

    throw new Error('Not implemented');
  }

  @SagaEventHandler('OrderPaidEvent', { associationProperty: 'orderId' })
  public async handleOrderPaid(event: OrderShippedEvent) {
    this.state.paid = true;
    await this.commandBus.dispatch(new ShipOrderCommand(event.orderId));
  }

  @SagaEventHandler('OrderShippedEvent', { associationProperty: 'orderId' })
  public async handleOrderShipped(event: OrderShippedEvent) {
    this.state.shipped = true;
  }

  @SagaEventHandler('OrderCancelledEvent', { associationProperty: 'orderId' })
  public async handleOrderCancelled(event: OrderCancelledEvent) {
    throw new Error('Not implemented');
  }

  @SagaEnd()
  @SagaEventHandler('OrderDeliveredEvent', { associationProperty: 'orderId' })
  public handleOrderCompleted(event: OrderCompletedEvent) {
    this.state.delivered = true;
  }
}
