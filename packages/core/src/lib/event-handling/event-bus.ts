import { EventMessage } from './event-message';
import { Registration } from '../common/registration';
import { EventHandlerDefinition } from './event-handler-definition';

export interface EventBus {
  dispatch<T>(event: EventMessage<T>): Promise<void>;
  subscribe<T extends EventMessage>(handlerDefinition: EventHandlerDefinition): Registration;
}
