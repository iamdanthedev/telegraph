import { Observable } from 'rxjs';
import { Message } from './message';
import { MessageListener } from './message-listener';
import { Registration } from '../common/registration';

export interface MessageBus {
  publish(message: Message<any>): Promise<void>;
  registerListener(listener: MessageListener<any>): Registration;
  asObservable(): Observable<Message<any>>;
}
