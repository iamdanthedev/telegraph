import { EventMessage } from './event-message';
import { MessageHandler } from '../messaging/message-handler';
import { Registration } from '../common/registration';

export interface EventBus {
  dispatch<T>(event: EventMessage<T>): Promise<void>;
  subscribe<T extends EventMessage>(eventName: string, handler: MessageHandler<T, any>): Registration;
}
