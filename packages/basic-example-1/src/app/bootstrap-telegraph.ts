import {
  TelegraphContext,
  BasicUnitOfWorkFactory,
  ConsoleLoggerFactory,
  LocalMessageBus,
  SimpleEventBus,
  SimpleCommandBus,
} from '@telegraph/core';
import { SagaManager } from '@telegraph/sagas';
import { MongoSagaStateRepository } from '@telegraph/sagas-mongodb';
import { placeOrderCommandHandlerDefinition } from './command-handler/place-order.command-handler';
import { orderPlacedEventHandlerDefinition } from './event-handler/order-placed.event-handler';
import { orderSagaDefinitions } from './sagas/order.saga';

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

  const sagaManager = new SagaManager(
    loggerFactory,
    unitOfWorkFactory,
    new MongoSagaStateRepository({
      uri: 'mongodb://localhost:27017/telegraph-dev',
    })
  );

  orderSagaDefinitions.forEach((definition) => sagaManager.register(definition));

  TelegraphContext.commandBus.subscribe(placeOrderCommandHandlerDefinition);
  TelegraphContext.eventBus.subscribe(orderPlacedEventHandlerDefinition);

  return sagaManager;
}
