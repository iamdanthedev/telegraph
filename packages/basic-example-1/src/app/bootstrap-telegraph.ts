import {
  BasicUnitOfWorkFactory,
  ConsoleLoggerFactory,
  CommandGateway,
  LocalMessageBus,
  SimpleCommandBus,
} from '@telegraph/core';
import { LogToConsoleCommandHandler } from './command/log-to-console.command';

export function bootstrapTelegraph() {
  const loggerFactory = new ConsoleLoggerFactory();
  const unitOfWorkFactory = new BasicUnitOfWorkFactory(loggerFactory);
  const messageBus = new LocalMessageBus(loggerFactory, unitOfWorkFactory);
  const commandBus = new SimpleCommandBus(messageBus, loggerFactory, unitOfWorkFactory);
  const commandGateway = new CommandGateway(messageBus, commandBus, loggerFactory);

  commandBus.subscribe('LogToConsoleCommand', new LogToConsoleCommandHandler());

  return {
    messageBus,
    commandBus,
    commandGateway,
  };
}
