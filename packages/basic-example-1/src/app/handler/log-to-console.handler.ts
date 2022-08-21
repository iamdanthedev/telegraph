import { LogToConsoleCommand } from '../command/log-to-console.command';

export class LogToConsoleHandler {
  async handle(command: LogToConsoleCommand) {
    if (command.shouldFail) {
      throw new Error(command.message);
    }

    console.log('handler says: ', command.message);
    return Promise.resolve(command.message);
  }
}
