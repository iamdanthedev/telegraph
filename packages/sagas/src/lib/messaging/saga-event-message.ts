import { EventMessage, BaseMessage, MessageMetadata } from '@telegraph/core';

export interface SagaEventMessage<T = any> extends EventMessage<T> {
  sagaId: string;
  sagaInstanceId: string;
}

export function isSagaEventMessage(
  arg: BaseMessage
): arg is SagaEventMessage<unknown> {
  return arg.type === 'event' && !!arg.metadata['sagaId'];
}
