import { filter, mergeMap, Observable, Subscription } from 'rxjs';
import { EventBus } from './event-bus';
import { EventMessage, isEventMessage } from './event-message';
import { EventHandlerDefinition } from './event-handler-definition';
import { MessageBus } from '../messaging/message-bus';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';
import { UnitOfWorkFactory } from '../unit-of-work/unit-of-work-factory';
import { assertNonNull } from '../utils';
import { Registration } from '../common/registration';
import { UnitOfWork, UnitOfWorkPhase } from '../unit-of-work/unit-of-work';
import { CurrentUnitOfWork } from '../unit-of-work/current-unit-of-work';

export class SimpleEventBus implements EventBus {
  private logger: Logger;
  private handleStream: Subscription;
  private handlers: Record<string, Array<EventHandlerDefinition>> = {};
  private eventsQueue: Record<string, Array<EventMessage<any>>> = {};

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
        next: async (handler) => {
          await handler();
        },
        error: (err) => {
          console.log('event bus error', err);
          this.logger.error(err);
        },
        complete: () => {
          this.logger.debug('Event bus completed');
        },
      });
  }

  asObservable(): Observable<EventMessage> {
    return this.messageBus.asObservable().pipe(
      filter(isEventMessage),
      filter((x, index) => {
        console.log('filter', x, index);
        return true;
      })
    );
  }

  async dispatch<T>(event: EventMessage<T>): Promise<void> {
    if (!isEventMessage(event)) {
      throw new Error('Event is not an EventMessage');
    }

    const unitOfWork = CurrentUnitOfWork.get();

    if (unitOfWork) {
      unitOfWork.start();
      this.logger.debug(`Dispatching event [${event.eventName}] in unit of work [${unitOfWork.id}]`);
      return this.dispatchInUnitOfWork(event, unitOfWork);
    } else {
      this.logger.debug(`Dispatching event [${event.eventName}] immediately`);
      return this.dispatchImmediately(event);
    }
  }

  async dispatchInUnitOfWork<T>(event: EventMessage<T>, unitOfWork: UnitOfWork<EventMessage<T>>): Promise<void> {
    if (unitOfWork.phase !== UnitOfWorkPhase.Started) {
      throw new Error('Cannot dispatch event in a unit of work that is not started');
    }

    const queue = this.getOrCreateEventsQueue(unitOfWork);
    queue.push(event);
  }

  async dispatchImmediately<T>(event: EventMessage<T>): Promise<void> {
    await this.messageBus.publish(event);
  }

  subscribe<T extends EventMessage>(definition: EventHandlerDefinition): Registration {
    const { eventName } = definition;

    this.logger.debug(`Registering event handler for [${eventName}]`);
    assertNonNull(definition, 'handler cannot be null');

    this.handlers[eventName] = this.handlers[eventName] || [];
    this.handlers[eventName].push(definition);

    return () => this.handlers[eventName].splice(this.handlers[eventName].indexOf(definition), 1);
  }

  private getHandlers<T extends EventMessage>(eventName: string): Array<EventHandlerDefinition> {
    return this.handlers[eventName] || [];
  }

  private async handle<T extends EventMessage>(event: T, handler: EventHandlerDefinition): Promise<void> {
    const unitOfWork = this.unitOfWorkFactory.create(event);
    unitOfWork.start();

    try {
      this.logger.debug(`Executing event handler for [${event.eventName}]`);
      await unitOfWork.execute(() => handler.handleCallback(event));
    } catch (err) {
      const error = err instanceof Error ? err : new Error((err as any)?.toString());
      this.logger.error('Error executing event handler', error);
    }
  }

  private getOrCreateEventsQueue(unitOfWork: UnitOfWork<any>): Array<EventMessage> {
    if (this.eventsQueue[unitOfWork.id]) {
      return this.eventsQueue[unitOfWork.id];
    }

    const queue: Array<EventMessage> = [];

    unitOfWork.onCommit(async () => {
      this.logger.debug(`Committing events for unit of work [${unitOfWork.id}]. Total: ${queue.length}`);
      await Promise.all(queue.map((event) => this.dispatchImmediately(event)));
    });

    unitOfWork.onCleanup(async () => {
      delete this.eventsQueue[unitOfWork.id];
      return Promise.resolve();
    });

    this.eventsQueue[unitOfWork.id] = queue;

    return queue;
  }
}
