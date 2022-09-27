import * as uuid from 'uuid';
import { CommandHandlerDefinition, EventMessageFactory, TelegraphContext } from '@telegraph/core';
import { PayOrderCommand } from '../command/pay-order.command';
import { OrderPaidEvent } from '../events/order-paid.event';

export const payOrderCommandHandlerDefinition: CommandHandlerDefinition<PayOrderCommand> = {
  commandName: 'PayOrderCommand',
  canHandleCallback: (message) => {
    return message.commandName === 'PayOrderCommand';
  },
  handleCallback: async (command) => {
    console.log('handling payment');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('payment done');

    const invoiceId = uuid.v4();

    await TelegraphContext.eventBus.dispatch(
      EventMessageFactory.create<OrderPaidEvent>('OrderPaidEvent', {
        orderId: command.payload.orderId,
        invoiceId,
        total: command.payload.total,
      })
    );
  },
};
