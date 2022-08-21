import { TelegraphContext } from './telegraph-context';
import { contextStorage } from "./context-storage";
import { Logger } from '../logging/logger';
import { ConsoleLogger } from '../logging/console-logger';
import { LocalMessageBus } from '../local-message-bus/local-message-bus';
import { CommandBus } from '../command-bus/command-bus';
import { EventBus } from '../event-bus/event-bus';

export interface TelegraphContextOptions {
  isGlobal: boolean;
  logger?: Logger;
}

export function createTelegraphContext(options: TelegraphContextOptions) {
  const logger = options?.logger || new ConsoleLogger();

  const messageBus = new LocalMessageBus(logger);
  const commandBus = new CommandBus(messageBus, logger);
  const eventBus = new EventBus(messageBus, logger);

  const context: TelegraphContext = {
    isGlobal: options.isGlobal,
    logger,
    messageBus,
    commandBus,
    eventBus,
  };

  return context;
}
