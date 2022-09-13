import { filter, mergeMap, Subscription } from 'rxjs';
import { EventBus } from './event-bus';
import { EventMessage, isEventMessage } from './event-message';
import { MessageHandler } from '../messaging/message-handler';
import { MessageBus } from '../messaging/message-bus';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';
import { UnitOfWorkFactory } from '../unit-of-work/unit-of-work-factory';
import { assertNonNull } from '../utils';
import { Registration } from '../common/registration';

export class SimpleEventBus implements EventBus {
  private logger: Logger;
  private handleStream: Subscription;
  private handlers: Record<string, Array<MessageHandler<EventMessage, any>>> = {};

  constructor(
    private readonly messageBus: MessageBus,
    private readonly loggerFactory: LoggerFactory,
    private readonly unitOfWorkFactory: UnitOfWorkFactory
  ) {
    this.logger = loggerFactory.create('SimpleEventBus');

    this.handleStream = messageBus
      .asObservable()
      .pipe(
        filter(isEventMessage),
        mergeMap((event) => {
          const handlers = this.getHandlers(event.eventName);
          return handlers.map((handler) => () => this.handle(event, handler));
        })
      )
      .subscribe({
        next: (handler) => handler(),
        error: (err) => {
          console.log('event bus error', err);
          this.logger.error(err);
        },
        complete: () => {
          this.logger.debug('Event bus completed');
        },
      });
  }

  async dispatch<T>(event: EventMessage<T>): Promise<void> {
    this.logger.debug(`Dispatching event [${event.eventName}]`);

    if (!isEventMessage(event)) {
      throw new Error('Event is not an EventMessage');
    }

    await this.messageBus.publish(event);
  }

  subscribe<T extends EventMessage>(eventName: string, handler: MessageHandler<T, any>): Registration {
    this.logger.debug(`Registering event handler for [${eventName}]`);
    assertNonNull(handler, 'handler cannot be null');

    this.handlers[eventName] = this.handlers[eventName] || [];
    this.handlers[eventName].push(handler);

    return () => this.handlers[eventName].splice(this.handlers[eventName].indexOf(handler), 1);
  }

  private getHandlers<T extends EventMessage>(eventName: string): Array<MessageHandler<T, any>> {
    return this.handlers[eventName] || [];
  }

  private async handle<T extends EventMessage>(event: T, handler: MessageHandler<T, any>): Promise<void> {
    const unitOfWork = this.unitOfWorkFactory.create(event);

    try {
      this.logger.debug(`Exwcuting event handler for [${event.eventName}]`);
      await unitOfWork.execute(handler);
    } catch (err) {
      const error = err instanceof Error ? err : new Error((err as any)?.toString());
      this.logger.error('Error executing event handler', error);
    }
  }
}
