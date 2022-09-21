import { MessageBus } from '../messaging/message-bus';
import { EventBus } from '../event-handling/event-bus';
import { CommandBus } from '../command-handling/command-bus';
import { UnitOfWorkFactory } from '../unit-of-work/unit-of-work-factory';
import { LoggerFactory } from '../logging/logger-factory';

export interface ITelegraphContext {
  loggerFactory: LoggerFactory;
  messageBus: MessageBus;
  eventBus: EventBus;
  commandBus: CommandBus;
  unitOfWorkFactory: UnitOfWorkFactory;
}

export class TelegraphContext {
  static initialized = false;

  static loggerFactory: LoggerFactory;
  static messageBus: MessageBus;
  static eventBus: EventBus;
  static commandBus: CommandBus;
  static unitOfWorkFactory: UnitOfWorkFactory;

  static instance: TelegraphContext;

  static register(context: ITelegraphContext) {
    if (TelegraphContext.initialized) {
      throw new Error('TelegraphContext is already initialized');
    }

    TelegraphContext.loggerFactory = context.loggerFactory;
    TelegraphContext.messageBus = context.messageBus;
    TelegraphContext.eventBus = context.eventBus;
    TelegraphContext.commandBus = context.commandBus;
    TelegraphContext.unitOfWorkFactory = context.unitOfWorkFactory;
    TelegraphContext.initialized = true;
  }
}
