import { CommandPublisher, ISaga, Saga, SagaEnd, SagaEventHandler, SagaStart } from '@telegraph/nestjs';
import { OrderPlacedEvent } from '../event/order-placed.event';
import { OrderPaidEvent } from '../../payment/event/order-paid.event';
import { OrderPaymentFailedEvent } from '../../payment/event/order-payment-failed.event';
import { ChargeCreditCardCommand } from '../../payment/command/charge-credit-card.command';
import { OrderShippedEvent } from '../../shipping/event/order-shipped.event';
import { OrderDeliveredEvent } from '../../shipping/event/order-delivered.event';
import { OrderCanceledEvent } from '../event/order-canceled.event';
import { ShipOrderCommand } from '../../shipping/command/ship-order.command';
import { CancelOrderCommand } from '../command/cancel-order.command';
import { OrderReturnedEvent } from '../../shipping/event/order-returned.event';
import { OrderRefundedEvent } from '../../payment/event/order-refunded.event';
import { RefundCreditCardCommand } from '../../payment/command/refund-credit-card.command';

export interface OrderPlacedSagaState {
  paid: boolean;
  shipped: boolean;
  delivered: boolean;
  canceled: boolean;
  amount: number;
}

@Saga()
export class OrderPlacedSaga implements ISaga<OrderPlacedSagaState> {
  state: OrderPlacedSagaState;

  constructor(private readonly commandPublisher: CommandPublisher) {}

  @SagaStart<OrderPlacedSagaState>({
    initialState: {
      paid: false,
      shipped: false,
      delivered: false,
      canceled: false,
      amount: -1,
    },
  })
  @SagaEventHandler(OrderPlacedEvent)
  async orderPlaced(event: OrderPlacedEvent) {
    this.state.amount = event.total;
    await this.commandPublisher.publish(new ChargeCreditCardCommand(event.orderId, event.total));
  }

  @SagaEventHandler(OrderPaidEvent)
  async orderPaid(event: OrderPaidEvent) {
    this.state.paid = true;

    await this.commandPublisher.publish(new ShipOrderCommand(event.orderId, event.customerName, 'test address'));
  }

  @SagaEventHandler(OrderPaymentFailedEvent)
  async orderPaymentFailed(event: OrderPaymentFailedEvent) {
    await this.commandPublisher.publish(new CancelOrderCommand(event.orderId, 'insufficient funds'));
  }

  @SagaEventHandler(OrderShippedEvent)
  async orderShipped(event: OrderShippedEvent) {
    console.log('order shipped. waiting for webhook...');
  }

  @SagaEventHandler(OrderReturnedEvent)
  async orderReturned(event: OrderReturnedEvent) {
    await this.commandPublisher.publish(new RefundCreditCardCommand(event.orderId, this.state.amount));
  }

  @SagaEventHandler(OrderRefundedEvent)
  async orderRefunded(event: OrderRefundedEvent) {
    await this.commandPublisher.publish(new CancelOrderCommand(event.orderId, 'order returned'));
  }

  @SagaEventHandler(OrderDeliveredEvent)
  @SagaEnd()
  async orderDelivered(event: OrderDeliveredEvent) {
    console.log('order delivered');
  }

  @SagaEventHandler(OrderCanceledEvent)
  @SagaEnd()
  async orderCanceled(event: OrderCanceledEvent) {
    console.log('order canceled');
  }
}