import { filter, Observable, single, Subject } from 'rxjs';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';
import { MessageBus } from './message-bus';
import { Message } from '../messaging/message';
import { Registration } from '../common/registration';
import { MessageInterceptor } from './message-interceptor';

export class LocalMessageBus implements MessageBus {
  private stream: Subject<Message<any>>;
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create('LocalMessageBus');
    this.stream = new Subject<Message<any>>();

    this.stream.subscribe({});
  }

  publish(message: Message<any>): Promise<void> {
    this.stream.next(message);
    return Promise.resolve();
  }

  registerListener(listener: MessageInterceptor<any>): Registration {
    const subscription = this.stream
      .asObservable()
      .pipe(
        filter((x) => x.type === listener.handlesMessageType()),
        filter((x) => listener.canHandle(x))
      )
      .subscribe({
        next: (message) => listener.handle(message),
      });

    return () => {
      subscription.unsubscribe();
    };
  }

  asObservable(): Observable<Message<any>> {
    return this.stream.asObservable();
  }
}
