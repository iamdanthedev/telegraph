import * as uuid from 'uuid';
import { CommandHandler, ICommandHandler, EventPublisher } from '@telegraph/nestjs';
import { CommandMessage } from '@telegraph/core';
import { ChargeCreditCardCommand } from '../command/charge-credit-card.command';
import { OrderPaidEvent } from '../event/order-paid.event';

@CommandHandler(ChargeCreditCardCommand)
export class ChargeCreditCardCommandHandler implements ICommandHandler<ChargeCreditCardCommand> {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async handle(command: ChargeCreditCardCommand, message: CommandMessage<ChargeCreditCardCommand>): Promise<void> {
    console.log('charging card...');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('card charged: ok');

    const invoiceId = uuid.v4();

    const event = new OrderPaidEvent(command.orderId, 'customer1', invoiceId, command.total);

    await this.eventPublisher.publish(event);
  }
}
