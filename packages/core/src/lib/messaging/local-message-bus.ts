import { filter, Observable, Subject } from 'rxjs';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';
import { MessageBus } from './message-bus';
import { MessagingTransport } from './messaging-transport';
import { Message } from '../messaging/message';
import { Registration } from '../common/registration';
import { MessageListenerDefinition } from './message-listener-definition';
import { UnitOfWorkFactory } from '../unit-of-work/unit-of-work-factory';

export class LocalMessageBus implements MessageBus {
  private stream: Subject<Message<any>>;
  private logger: Logger;
  private transports: MessagingTransport[] = [];

  constructor(private readonly loggerFactory: LoggerFactory, private readonly unitOfWorkFactory: UnitOfWorkFactory) {
    this.logger = loggerFactory.create('LocalMessageBus');
    this.stream = new Subject<Message<any>>();
    this.stream.subscribe({});
  }

  publish(message: Message<any>): Promise<void> {
    this.stream.next(message);
    return Promise.resolve();
  }

  registerTransport(transport: MessagingTransport) {
    this.transports.push(transport);
    transport.listener.subscribe(this.stream);
    this.stream.subscribe(transport.publisher);
  }

  registerListener<T extends Message = any>(listener: MessageListenerDefinition<T>): Registration {
    const subscription = this.stream
      .asObservable()
      .pipe(
        filter((x) => x.type === listener.canHandleMessageType()),
        filter((x) => listener.canHandle(x))
      )
      .subscribe({
        next: (message) => this.handleListener(message, listener),
      });

    return () => {
      subscription.unsubscribe();
    };
  }

  asObservable(): Observable<Message<any>> {
    return this.stream.asObservable();
  }

  private async handleListener<T>(message: Message<T>, listener: MessageListenerDefinition<Message<T>>): Promise<void> {
    const unitOfWork = this.unitOfWorkFactory.create(message);

    try {
      this.logger.debug(`Handling listener for [${message.type}:${message.messageId}]`);
      await unitOfWork.execute(() => listener.handle(message));
    } catch (err) {
      const error = err instanceof Error ? err : new Error((err as any)?.toString());
      this.logger.error(`Error handling listener for [${message.type}:${message.messageId}]`, error);
    }
  }
}
