import { Observable } from 'rxjs';
import { Message } from './message';
import { MessageListenerDefinition } from './message-listener-definition';
import { MessagingTransport } from './messaging-transport';
import { Registration } from '../common/registration';

export interface MessageBus {
  publish(message: Message<any>): Promise<void>;
  registerListener<T extends Message = any>(listener: MessageListenerDefinition<any>): Registration;
  registerTransport(transport: MessagingTransport): void;
  asObservable(): Observable<Message<any>>;
}
