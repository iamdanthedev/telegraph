import { LocalMessageBus } from '../local-message-bus/local-message-bus';
import { CommandBus } from '../command-bus/command-bus';
import { EventBus } from '../event-bus/event-bus';
import { Logger } from '../logging/logger';

export interface TelegraphContext {
  isGlobal: boolean;
  logger: Logger;
  messageBus: LocalMessageBus;
  commandBus: CommandBus;
  eventBus: EventBus;
}
