import { EventHandler, EventPublisher, IEventHandler } from '@telegraph/nestjs';
import { EventMessage } from '@telegraph/core';
import { OrderShippedEvent } from '../event/order-shipped.event';
import { OrderDeliveredEvent } from '../event/order-delivered.event';

@EventHandler(OrderShippedEvent)
export class OrderShippedEventHandler implements IEventHandler<OrderShippedEvent> {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async handle(event: OrderShippedEvent, message: EventMessage<OrderShippedEvent>): Promise<void> {
  }
}
