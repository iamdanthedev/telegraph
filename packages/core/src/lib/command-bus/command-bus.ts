import { filter, Observable, Observer, map } from 'rxjs';
import * as uuid from 'uuid';
import { TelegraphContext } from "../context/telegraph-context";
import { LocalMessageBus } from '../local-message-bus/local-message-bus';
import {
  CommandHandler,
  CommandMessage,
  CommandResultMessage,
  isCommandResultMessage,
  MessageMetadata,
} from '../interface';
import { createId } from '../utils';
import { Logger } from '../logging/logger';

export class CommandBus {
  private stream: Observable<CommandMessage>;
  private handlers: Record<string, Array<CommandHandler<any>>> = {};

  constructor(
    private readonly messageBus: LocalMessageBus,
    private readonly logger: Logger
  ) {
    this.stream = messageBus
      .asObservable()
      .pipe(
        filter((message) => message.type === 'command')
      ) as Observable<CommandMessage>;

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

    console.log('registered handler for command', commandName);
  }

  publish<T = unknown, R = unknown>(commandName: string, payload: T): void;
  publish<T = unknown, R = unknown>(
    commandName: string,
    payload: T,
    metadata: MessageMetadata
  ): void;
  publish<T = unknown, R = unknown>(
    commandName: string,
    payload: T,
    metadata: MessageMetadata,
    observer: Partial<Observer<CommandResultMessage<R>>> | undefined
  ): void;
  publish<T = unknown, R = unknown>(
    commandName: string,
    payload: T,
    metadata?: MessageMetadata,
    observer?: Partial<Observer<CommandResultMessage<R>>> | undefined
  ): void {
    metadata = metadata || {};

    const message: CommandMessage<T> = {
      messageId: createId(),
      commandName,
      type: 'command',
      payload,
      metadata,
    };

    this.messageBus.publish(message);
    console.log('published command', commandName);

    if (observer) {
      const observable = this.messageBus.asObservable().pipe(
        filter((incomingMessage: any) => {
          const result =
            isCommandResultMessage(incomingMessage) &&
            incomingMessage.commandName === commandName &&
            incomingMessage.commandMessageId === message.messageId;

          console.log(result);

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
      console.log('handler not found for command', command.commandName);
    }

    for (const handler of handlers) {
      // todo: start unit of work
      this.execute(command, handler).then();
    }
  }

  private async execute(command: CommandMessage, handler: CommandHandler) {
    try {
      const payload = await handler(command);

      const commandResultMessage: CommandResultMessage = {
        messageId: uuid.v4(),
        type: 'commandResult',
        commandName: command.commandName,
        commandMessageId: command.messageId,
        payload,
        exception: null,
      };

      this.messageBus.publish(commandResultMessage);
    } catch (e) {
      const commandResultMessage: CommandResultMessage = {
        messageId: uuid.v4(),
        type: 'commandResult',
        commandName: command.commandName,
        commandMessageId: command.messageId,
        payload: null,
        exception: e instanceof Error ? e : new Error((e as any).toString()),
      };

      this.messageBus.publish(commandResultMessage);
    }
  }
}
