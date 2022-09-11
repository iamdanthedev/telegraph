import { ResultMessage } from '../messaging/result-message';
import { createId } from '../utils';
import { MessageType } from '../common/message-type';

export interface CommandResultMessage<R> extends ResultMessage<R> {
  commandMessageId: string;
}

export function asCommandResultMessage<R>(
  commandMessageId: string,
  messageOrError: Error | R
): CommandResultMessage<R> {
  if (messageOrError instanceof Error) {
    return {
      commandMessageId,
      messageId: createId(),
      type: MessageType.CommandResult,
      isExceptional: true,
      exceptionDetails: messageOrError?.toString(),
      payload: null,
      metadata: {},
    };
  }

  return {
    commandMessageId,
    messageId: createId(),
    type: MessageType.CommandResult,
    isExceptional: false,
    exceptionDetails: null,
    payload: messageOrError,
    metadata: {},
  };
}
