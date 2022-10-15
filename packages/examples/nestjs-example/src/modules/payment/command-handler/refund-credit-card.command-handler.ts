import { CommandHandler, EventPublisher, ICommandHandler } from '@telegraph/nestjs';
import { CommandMessage } from '@telegraph/core';
import { RefundCreditCardCommand } from '../command/refund-credit-card.command';
import { OrderRefundedEvent } from '../event/order-refunded.event';

@CommandHandler(RefundCreditCardCommand)
export class RefundCreditCardCommandHandler implements ICommandHandler<RefundCreditCardCommand> {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async handle(command: RefundCreditCardCommand, message: CommandMessage<RefundCreditCardCommand>): Promise<void> {
    console.log('refunding card...');
    return new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('card refunded: ok');

    const event = new OrderRefundedEvent(command.orderId, command.amount);
    await this.eventPublisher.publish(event);
  }
}
