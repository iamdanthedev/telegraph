import { CommandMessage } from '@telegraph/core';

export interface SagaCommandMessage<T> extends CommandMessage<T> {
  sagaId: string;
}

export function isSagaCommandMessage(
  arg: CommandMessage
): arg is SagaCommandMessage<unknown> {
  return arg.type === 'command' && !!arg.metadata['sagaId'];
}
