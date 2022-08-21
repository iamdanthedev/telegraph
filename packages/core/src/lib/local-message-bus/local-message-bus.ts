import { Observable, Subject } from 'rxjs';
import { BaseMessage } from '../interface';
import { Logger } from '../logging/logger';

export class LocalMessageBus {
  private stream: Subject<BaseMessage>;

  constructor(private readonly logger: Logger) {
    this.stream = new Subject<BaseMessage>();
  }

  publish(message: BaseMessage) {
    this.stream.next(message);
  }

  asObservable(): Observable<BaseMessage> {
    return this.stream.asObservable();
  }
}
