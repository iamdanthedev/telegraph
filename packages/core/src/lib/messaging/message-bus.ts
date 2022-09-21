import { Observable } from 'rxjs';
import { Message } from './message';
import { MessageListenerDefinition } from './message-listener-definition';
import { Registration } from '../common/registration';

export interface MessageBus {
  publish(message: Message<any>): Promise<void>;
  registerListener<T extends Message = any>(listener: MessageListenerDefinition<any>): Registration;
  asObservable(): Observable<Message<any>>;
}
