import { Observable } from 'rxjs';
import { EventMessage } from './event-message';
import { EventHandlerDefinition } from './event-handler-definition';
import { Registration } from '../common/registration';

export interface EventBus {
  dispatch<T>(event: EventMessage<T>): Promise<void>;
  subscribe<T extends EventMessage>(handlerDefinition: EventHandlerDefinition): Registration;
  asObservable<T extends EventMessage>(): Observable<T>;
}
