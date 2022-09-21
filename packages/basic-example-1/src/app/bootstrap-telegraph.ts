import {
  TelegraphContext,
  BasicUnitOfWorkFactory,
  ConsoleLoggerFactory,
  LocalMessageBus,
  SimpleEventBus,
  SimpleCommandBus,
} from '@telegraph/core';
import { placeOrderCommandHandlerDefinition } from './command-handler/place-order.command-handler';
import { orderPlacedEventHandlerDefinition } from './event-handler/order-placed.event-handler';

export function bootstrapTelegraph() {
  const loggerFactory = new ConsoleLoggerFactory();
  const unitOfWorkFactory = new BasicUnitOfWorkFactory(loggerFactory);
  const messageBus = new LocalMessageBus(loggerFactory, unitOfWorkFactory);
  const eventBus = new SimpleEventBus(messageBus, loggerFactory, unitOfWorkFactory);
  const commandBus = new SimpleCommandBus(messageBus, loggerFactory, unitOfWorkFactory);

  TelegraphContext.register({
    loggerFactory,
    messageBus,
    eventBus,
    commandBus,
    unitOfWorkFactory,
  });

  TelegraphContext.commandBus.subscribe(placeOrderCommandHandlerDefinition);
  TelegraphContext.eventBus.subscribe(orderPlacedEventHandlerDefinition);
}
