import { Observer, Subject } from 'rxjs';
import { Message } from './message';

export interface MessagingTransport {
  publisher: Observer<Message>
  listener: Subject<Message>
}
