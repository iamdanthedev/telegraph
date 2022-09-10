import { Message } from '../messaging/message';
import { MessageType } from '../common/message-type';

export interface CommandMessage<T = unknown> extends Message<T> {
  commandName: string;
  type: MessageType.Command;
}

export function isCommandMessage(message: Message): message is CommandMessage<any> {
  return message.type == MessageType.Command;
}
