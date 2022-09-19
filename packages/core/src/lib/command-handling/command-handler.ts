import { CommandMessage } from './command-message';
import { MessageHandlerDefinition } from '../messaging/message-handler';

export interface CommandHandlerDefinition extends MessageHandlerDefinition<CommandMessage<any>> {}
