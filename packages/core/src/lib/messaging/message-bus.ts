import { Observable } from 'rxjs';
import { Message } from './message';
import { MessageInterceptor } from './message-interceptor';
import { Registration } from '../common/registration';

export interface MessageBus {
  publish(message: Message<any>): Promise<void>;
  registerListener(listener: MessageInterceptor<any>): Registration;
  asObservable(): Observable<Message<any>>;
}
