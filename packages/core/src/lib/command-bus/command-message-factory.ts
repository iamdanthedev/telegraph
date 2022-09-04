import { createId } from '../utils';
import { CommandMessage, MessageMetadata } from '../interface';

export class CommandMessageFactory {
  create<T>(commandName: string, payload: T, metadata?: MessageMetadata): CommandMessage<T> {
    return {
      messageId: createId(),
      type: 'command',
      commandName,
      metadata: metadata || {},
      payload,
    };
  }
}

