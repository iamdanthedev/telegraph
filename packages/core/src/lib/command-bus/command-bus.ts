import { filter, Observable, Observer, map } from 'rxjs';
import { CommandResultMessageFactory } from './command-result-message-factory';
import { LocalMessageBus } from '../local-message-bus/local-message-bus';
import {
  ExecutionContext,
  CommandHandler,
  CommandMessage,
  CommandResultMessage,
  isCommandResultMessage,
  MessageMetadata,
} from '../interface';
import { createId } from '../utils';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';
import { UnitOfWorkFactory } from '../unit-of-work/unit-of-work-factory';

export class CommandBus {
  private logger: Logger;
  private stream: Observable<CommandMessage>;
  private handlers: Record<string, Array<CommandHandler<any>>> = {};

  constructor(
    private readonly messageBus: LocalMessageBus,
    private readonly loggerFactory: LoggerFactory,
    private readonly unitOfWorkFactory: UnitOfWorkFactory
  ) {
    this.logger = loggerFactory.create('CommandBus');

    this.stream = messageBus
      .asObservable()
      .pipe(filter((message) => message.type === 'command')) as Observable<CommandMessage>;

    this.stream.subscribe({
      next: (commandMessage) => {
        return this.handle(commandMessage);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  registerHandler<T>(commandName: string, handler: CommandHandler<T>) {
    this.handlers[commandName] = this.handlers[commandName] || [];
    this.handlers[commandName].push(handler);

    this.logger.debug(`Registered handler for command ${commandName}`);
  }

  publish<T = unknown, R = unknown>(commandMessage: CommandMessage<T>): void;
  publish<T = unknown, R = unknown>(
    commandMessage: CommandMessage<T>,
    observer: Partial<Observer<CommandResultMessage<R>>> | undefined
  ): void;
  publish<T = unknown, R = unknown>(
    commandMessage: CommandMessage<T>,
    observer?: Partial<Observer<CommandResultMessage<R>>> | undefined
  ): void {
    this.messageBus.publish(commandMessage);
    this.logger.debug(`Command published: ${commandMessage.commandName}`);

    if (observer) {
      const observable = this.messageBus.asObservable().pipe(
        filter((incomingMessage: any) => {
          const result =
            isCommandResultMessage(incomingMessage) &&
            incomingMessage.commandName === commandMessage.commandName &&
            incomingMessage.commandMessageId === commandMessage.messageId;

          return result;
        }),
        map((incomingMessage: CommandResultMessage) => {
          if (incomingMessage.exception) {
            throw incomingMessage.exception;
          }

          return incomingMessage;
        })
      ) as Observable<CommandResultMessage<R>>;

      observable.subscribe(observer);
    }
  }

  private handle(command: CommandMessage) {
    const handlers = this.handlers[command.commandName];

    if (!handlers?.length) {
      this.logger.debug(`No handlers found for command: ${command.commandName}`);
    }

    for (const handler of handlers) {
      // todo: start unit of work
      this.execute(command, handler).then();
    }
  }

  private async execute(command: CommandMessage, handler: CommandHandler) {
    const unitOfWork = this.unitOfWorkFactory.create(command, handler);

    await unitOfWork.run(async (context) => {
      try {
        const result = await handler(command, {
          commandPublisher: context.commandPublisher,
          logger: context.loggerFactory.create(command.commandName),
        });

        const resultMessage = CommandResultMessageFactory.createSuccess(command.commandName, command.messageId, result);
        context.eventPublisher.publish(resultMessage);
        await unitOfWork.commit();
      } catch (e) {
        const resultMessage = CommandResultMessageFactory.createExceptional(command.commandName, command.messageId, e);
        context.eventPublisher.publish(resultMessage);
        await unitOfWork.rollback();
      }
    });
  }
}
