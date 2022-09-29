import { CommandHandlerDefinition, EventMessageFactory, TelegraphContext } from '@telegraph/core';
import { PlaceOrderCommand } from '../command/place-order.command';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { OrderCanceledEvent } from '../events/order-canceled.event';

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

    if (command.payload.total < 100) {
      // too expensive
      await TelegraphContext.eventBus.dispatch(
        EventMessageFactory.create<OrderCanceledEvent>('OrderCanceledEvent', {
          orderId: command.payload.orderId,
          reason: 'Order too expensive',
        })
      );

      return 'Order placed';
    } else {
      await TelegraphContext.eventBus.dispatch(
        EventMessageFactory.create<OrderPlacedEvent>('OrderPlacedEvent', {
          orderId: command.payload.orderId,
          customerName: command.payload.customerName,
          total: command.payload.total,
        })
      );

      return 'Order too expensive';
    }
  },
};
