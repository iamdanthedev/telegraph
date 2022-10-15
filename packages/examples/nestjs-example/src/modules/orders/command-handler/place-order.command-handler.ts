import { CommandHandler, EventPublisher, ICommandHandler } from '@telegraph/nestjs';
import { CommandMessage } from '@telegraph/core';
import { PlaceOrderCommand } from '../command/place-order.command';
import { OrderPlacedEvent } from '../event/order-placed.event';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderCommandHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async handle(command: PlaceOrderCommand, message: CommandMessage<PlaceOrderCommand>): Promise<void> {
    console.log('placing order...');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const event = new OrderPlacedEvent(command.orderId, command.customerId, command.total);
    await this.eventPublisher.publish(event);
  }
}
