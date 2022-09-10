import { CommandMessage } from './command-message';
import { CommandResultMessage } from './command-result-message';

export interface CommandCallback<C, R> {
  onResult(commandMessage: CommandMessage<C>, commandResultMessage: CommandResultMessage<R>): void;
}
