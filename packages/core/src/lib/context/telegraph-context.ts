import { LocalMessageBus } from '../local-message-bus/local-message-bus';
import { CommandBus } from '../command-bus/command-bus';
import { EventBus } from '../event-bus/event-bus';
import { LoggerFactory } from "../logging/logger-factory";
import { UnitOfWorkFactory } from "../unit-of-work/unit-of-work-factory";

export interface TelegraphContext {
  isGlobal: boolean;
  loggerFactory: LoggerFactory;
  messageBus: LocalMessageBus;
  commandBus: CommandBus;
  eventBus: EventBus;
  unitOfWorkFactory: UnitOfWorkFactory;
}
