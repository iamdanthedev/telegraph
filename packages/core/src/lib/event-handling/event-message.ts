import { MessageType } from '../common/message-type';
import { Message } from '@telegraph/core';

export interface EventMessage<T = unknown> extends Message<T> {
  eventName: string;
  type: MessageType.Event;
}

export function isEventMessage(message: Message): message is EventMessage<any> {
  return message.type === MessageType.Event;
}
