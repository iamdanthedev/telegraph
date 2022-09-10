import { createId } from '../utils';
import { CommandMessage } from './command-message';
import { MessageMetadata } from '../messaging/message';
import { MessageType } from '../common/message-type';

export class CommandMessageFactory {
  static create<T>(commandName: string, payload: T, metadata?: MessageMetadata): CommandMessage<T> {
    return {
      messageId: createId(),
      type: MessageType.Command,
      commandName,
      metadata: metadata || {},
      payload,
    };
  }
}
