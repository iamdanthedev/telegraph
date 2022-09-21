import { EventMessage } from './event-message';
import { MessageHandlerDefinition } from '../messaging/message-handler-definition';

export interface EventHandlerDefinition<T = any> extends MessageHandlerDefinition<EventMessage<T>> {
  eventName: string;
}
