import { CommandHandlerDefinition, EventMessageFactory, TelegraphContext } from '@telegraph/core';
import { PlaceOrderCommand } from '../command/place-order.command';
import { OrderPlacedEvent } from '../events/order-placed.event';

export const placeOrderCommandHandlerDefinition: CommandHandlerDefinition<PlaceOrderCommand> = {
  commandName: 'PlaceOrderCommand',
  canHandleCallback: (message) => {
    return message.commandName === 'PlaceOrderCommand';
  },
  handleCallback: async (command) => {
    if (command.payload.total <= 0) {
      throw new Error('Invalid order total');
    }

    if (!command.payload.customerName) {
      throw new Error('Invalid customer name');
    }

    console.log('Placing order for: ' + command.payload.customerName);

    await TelegraphContext.eventBus.dispatch(
      EventMessageFactory.create<OrderPlacedEvent>('OrderPlacedEvent', {
        orderId: command.payload.orderId,
        customerName: command.payload.customerName,
        total: command.payload.total,
      })
    );

    return 'Order placed';
  },
};
