import { CommandResultMessage } from './command-result-message';
import { CommandMessage } from './command-message';
import { MessageListener } from '../messaging/message-listener';
import { MessageType } from '../common/message-type';

export interface CommandResultListenerParams<T> {
  command: CommandMessage;
  timeout: number;
  onMessage: (result: CommandResultMessage<T>) => Promise<void> | void;
  onTimeout: () => Promise<void> | void;
  onError: (error: Error) => Promise<void> | void;
}

export class CommandResultListener<T> implements MessageListener<CommandResultMessage<any>> {
  constructor(private readonly params: CommandResultListenerParams<T>) {}

  async handle(message: CommandResultMessage<T>) {
    try {
      await this.params.onMessage(message);
    } catch (err) {
      const error = err instanceof Error ? err : new Error((err as any)?.toString());
      await this.params.onError(error);
    }
  }

  handlesMessageType(): MessageType {
    return MessageType.CommandResult;
  }

  canHandle(commandResultMessage: CommandResultMessage<any>) {
    return commandResultMessage.commandMessageId === this.params.command.messageId;
  }
}
