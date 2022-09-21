import { EventHandlerDefinition } from '@telegraph/core';

export const orderPlacedEventHandlerDefinition: EventHandlerDefinition = {
  eventName: 'OrderPlacedEvent',
  canHandleCallback: (message) => {
    return message.eventName === 'OrderPlacedEvent';
  },
  handleCallback: async (message) => {
    console.log('Order placed for: ' + message.payload.customerName);
  },
};
