import { CommandHandler, EventPublisher, ICommandHandler } from '@telegraph/nestjs';
import { CommandMessage } from '@telegraph/core';
import { ShipOrderCommand } from '../command/ship-order.command';
import { OrderShippedEvent } from '../event/order-shipped.event';

@CommandHandler(ShipOrderCommand)
export class ShipOrderCommandHandler implements ICommandHandler<ShipOrderCommand> {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async handle(command: ShipOrderCommand, message: CommandMessage<ShipOrderCommand>): Promise<void> {
    console.log('shipping order...');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('order shipped');

    await this.eventPublisher.publish(new OrderShippedEvent(command.orderId, command.customerName, command.address));
  }
}
