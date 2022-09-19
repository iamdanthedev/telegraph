import { EventMessage } from './event-message';
import { MessageMetadata } from '../messaging/message';
import { MessageType } from '../common/message-type';
import { createId } from '../utils';

export class EventMessageFactory {
  static create<T>(eventName: string, payload: T, metadata?: MessageMetadata): EventMessage<T> {
    return {
      messageId: createId(),
      type: MessageType.Event,
      eventName,
      payload,
      metadata: metadata || {},
    };
  }
}
