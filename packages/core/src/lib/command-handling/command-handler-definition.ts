import { CommandMessage } from './command-message';
import { MessageHandlerDefinition } from '../messaging/message-handler-definition';

export interface CommandHandlerDefinition<T = any> extends MessageHandlerDefinition<CommandMessage<T>> {
  commandName: string;
}
