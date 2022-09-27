import * as uuid from 'uuid';
import { CommandHandlerDefinition, EventMessageFactory, TelegraphContext } from '@telegraph/core';
import { ShipOrderCommand } from '../command/ship-order.command';
import { OrderShippedEvent } from '../events/order-shipped.event';

export const shipOrderCommandHandlerDefinition: CommandHandlerDefinition<ShipOrderCommand> = {
  commandName: 'ShipOrderCommand',
  canHandleCallback: (message) => {
    return message.commandName === 'ShipOrderCommand';
  },
  handleCallback: async (command) => {
    console.log('handling shipment');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('shipment dispatched');

    const invoiceId = uuid.v4();

    await TelegraphContext.eventBus.dispatch(
      EventMessageFactory.create<OrderShippedEvent>('OrderShippedEvent', {
        orderId: command.payload.orderId,
        customerName: command.payload.customerName,
        address: command.payload.address,
      })
    );
  },
};
