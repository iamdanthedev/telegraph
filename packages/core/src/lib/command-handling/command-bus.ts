import { CommandMessage } from './command-message';
import { MessageHandler } from '../messaging/message-handler';
import { Registration } from '../common/registration';

export interface CommandBus {
  dispatch<C>(command: CommandMessage<C>): Promise<void>;
  subscribe<T extends CommandMessage>(commandName: string, handler: MessageHandler<T, any>): Registration;
}
