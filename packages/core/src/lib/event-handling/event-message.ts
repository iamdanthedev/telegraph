import { MessageType } from '../common/message-type';
import { Message } from '@telegraph/core';

export interface EventMessage<T extends Record<string, any> = Record<string, any>> extends Message<T> {
  eventName: string;
  type: MessageType.Event;
}

export function isEventMessage(message: Message): message is EventMessage<any> {
  return message.type === MessageType.Event;
}
