import { CommandMessage } from "@telegraph/core";

export interface ICommandHandler<T> {
  handle(command: T, message: CommandMessage<T>): Promise<void>;
}
