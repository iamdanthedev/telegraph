import { CommandHandler, CommandMessage } from '@telegraph/core';

export interface LogToConsoleCommand {
  message: string;
  shouldFail: boolean;
}

export class LogToConsoleCommandHandler implements CommandHandler<CommandMessage<LogToConsoleCommand>> {
  canHandle(command: CommandMessage<LogToConsoleCommand>): boolean {
    return command.commandName === 'LogToConsoleCommand';
  }

  handle(command: CommandMessage<LogToConsoleCommand>): any {
    console.log('HANDLING', command.payload.message);
    return "DONE";
  }
}
