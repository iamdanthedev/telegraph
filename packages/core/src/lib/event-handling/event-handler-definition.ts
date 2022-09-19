import { EventMessage } from './event-message';
import { MessageHandlerDefinition } from '../messaging/message-handler';

export interface EventHandlerDefinition extends MessageHandlerDefinition<EventMessage<any>> {}
