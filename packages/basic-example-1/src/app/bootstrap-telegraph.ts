import { ConsoleLoggerFactory, createTelegraphContext } from '@telegraph/core';
import { LogToConsoleCommand } from './command/log-to-console.command';
import { constants } from './constants';

export function bootstrapTelegraph() {
  const context = createTelegraphContext({
    isGlobal: true,
    loggerFactory: new ConsoleLoggerFactory(),
  });

  context.commandBus.registerHandler<LogToConsoleCommand>(
    constants.LogToConsoleCommand,
    (message, context) => {
      const { payload } = message;

      if (payload.shouldFail) {
        throw new Error(payload.message);
      }

      context.logger.log('handler says: ', payload.message);
      return Promise.resolve(payload.message);
    }
  );

  return context;
}
