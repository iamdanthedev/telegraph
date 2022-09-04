import { CommandResultMessage, createId } from "@telegraph/core";

export class CommandResultMessageFactory {
  static createSuccess<T>(commandName: string, commandMessageId: string, payload: T): CommandResultMessage<T> {
    return {
      messageId: createId(),
      type: 'commandResult',
      commandName,
      commandMessageId,
      metadata: {},
      payload,
      exception: null,
      isExceptional: false,
    };
  }

  static createExceptional(commandName: string, commandMessageId: string, exception: Error): CommandResultMessage {
    return {
      messageId: createId(),
      type: 'commandResult',
      commandName,
      commandMessageId,
      payload: null,
      metadata: {},
      exception,
      isExceptional: true,
    };
  }
}
