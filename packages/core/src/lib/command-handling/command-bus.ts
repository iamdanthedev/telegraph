import { CommandMessage } from './command-message';
import { Registration } from '../common/registration';
import { CommandHandlerDefinition } from './command-handler';

export interface CommandBus {
  dispatch<C>(command: CommandMessage<C>): Promise<void>;
  subscribe<T extends CommandMessage>(commandName: string, handler: CommandHandlerDefinition): Registration;
}
