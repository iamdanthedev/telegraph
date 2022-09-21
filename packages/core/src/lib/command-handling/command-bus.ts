import { CommandMessage } from './command-message';
import { Registration } from '../common/registration';
import { CommandHandlerDefinition } from './command-handler-definition';

export interface CommandBus {
  dispatch<C>(command: CommandMessage<C>): Promise<void>;
  subscribe<T extends CommandMessage>(handlerDefinition: CommandHandlerDefinition): Registration;
}
