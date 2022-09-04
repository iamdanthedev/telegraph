import { Observable, Subject } from 'rxjs';
import { BaseMessage } from '../interface';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';

export class LocalMessageBus {
  private stream: Subject<BaseMessage>;
  private logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create('LocalMessageBus');
    this.stream = new Subject<BaseMessage>();
  }

  publish(message: BaseMessage) {
    this.stream.next(message);
  }

  asObservable(): Observable<BaseMessage> {
    return this.stream.asObservable();
  }
}
