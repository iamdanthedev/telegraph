import { CommandMessage, CommandPublisher } from '../interface';
import { TelegraphContext } from "../context/telegraph-context";

export class BufferedCommandPublisher implements CommandPublisher {
  constructor(private readonly context: TelegraphContext) {}

  private readonly commands: CommandMessage[] = [];

  publish(command: CommandMessage) {
    this.commands.push(command);
  }

  getCommands() {
    return this.commands;
  }

  async execute() {
    for (const command of this.commands) {
      await this.context.commandBus.publish(command);
    }
  }

  rollback() {
    this.commands.length = 0;
  }
}
