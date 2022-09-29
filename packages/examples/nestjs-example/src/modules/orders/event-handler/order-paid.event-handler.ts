import { CommandPublisher, EventHandler, IEventHandler } from '@telegraph/nestjs';
import { OrderPaidEvent } from '../event/order-paid.event';

@EventHandler(OrderPaidEvent)
export class OrderPaidEventHandler implements IEventHandler<OrderPaidEvent> {
  constructor(private readonly commandPublisher: CommandPublisher) {}

  handle(event: OrderPaidEvent): Promise<void> {
    console.log('OrderPaidEventHandler', event);
    return Promise.resolve();
  }
}
