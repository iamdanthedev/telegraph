import { BasicUnitOfWorkFactory, ConsoleLoggerFactory, LocalMessageBus, SimpleCommandBus } from '@telegraph/core';
import { LogToConsoleCommandHandler } from './command/log-to-console.command';

export function bootstrapTelegraph() {
  const loggerFactory = new ConsoleLoggerFactory();
  const messageBus = new LocalMessageBus(loggerFactory);
  const commandBus = new SimpleCommandBus(messageBus, loggerFactory, new BasicUnitOfWorkFactory(loggerFactory));

  commandBus.subscribe('LogToConsoleCommand', new LogToConsoleCommandHandler());

  return {
    messageBus,
    commandBus,
  };
}
