import * as uuid from 'uuid';
import { CommandHandler, ICommandHandler, EventBus } from '@telegraph/nestjs';
import { CommandMessage } from '@telegraph/core';
import { PayOrderCommand } from '../command/pay-order.command';
import { OrderPaidEvent } from '../event/order-paid.event';

@CommandHandler(PayOrderCommand)
export class PayOrderCommandHandler implements ICommandHandler<PayOrderCommand> {
  constructor(private readonly eventBus: EventBus) {}

  async handle(command: PayOrderCommand, message: CommandMessage<PayOrderCommand>): Promise<void> {
    console.log('handling payment');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('payment done');

    const invoiceId = uuid.v4();

    const event = new OrderPaidEvent(command.orderId, invoiceId, command.total);

    await this.eventBus.dispatch(event);
  }
}
