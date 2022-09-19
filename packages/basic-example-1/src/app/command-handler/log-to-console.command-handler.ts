import { CommandHandler, CommandMessage, MessageHandlerContext } from '@telegraph/core';
import { LogToConsoleCommand } from '../command/log-to-console.command';
import { LoggedToConsoleEvent } from '../events/logged-to-console.event';

export class LogToConsoleCommandHandler implements CommandHandler<CommandMessage<LogToConsoleCommand>> {
  canHandle(command: CommandMessage<LogToConsoleCommand>): boolean {
    return command.commandName === 'LogToConsoleCommand';
  }

  async handle(command: CommandMessage<LogToConsoleCommand>, context: MessageHandlerContext) {
    if (command.payload.shouldFail) {
      throw new Error('Failed to log to console');
    }

    console.log('HANDLING', command.payload.message);

    await context.eventGateway.dispatch('LoggedToConsoleEvent', new LoggedToConsoleEvent(command.payload.message));

    return 'DONE';
  }
}
