import { filter, mergeMap, Subscription } from 'rxjs';
import { CommandMessage, isCommandMessage } from './command-message';
import { asCommandResultMessage } from './command-result-message';
import { CommandHandlerDefinition } from './command-handler-definition';
import { MessageBus } from '../messaging/message-bus';
import { CommandBus } from './command-bus';
import { Registration } from '../common/registration';
import { assertNonNull } from '../utils';
import { Logger } from '../logging/logger';
import { LoggerFactory } from '../logging/logger-factory';
import { UnitOfWorkFactory } from '../unit-of-work/unit-of-work-factory';

export class SimpleCommandBus implements CommandBus {
  private logger: Logger;
  private handleStream: Subscription;
  private handlers: Record<string, Array<CommandHandlerDefinition>> = {};

  constructor(
    private readonly messageBus: MessageBus,
    private readonly loggerFactory: LoggerFactory,
    private readonly unitOfWorkFactory: UnitOfWorkFactory
  ) {
    this.logger = loggerFactory.create('SimpleCommandBus');

    this.handleStream = messageBus
      .asObservable()
      .pipe(
        filter(isCommandMessage),
        mergeMap((command) => {
          const handlers = this.getHandlers(command.commandName);
          return handlers.map((handler) => () => this.handle(command, handler));
        })
      )
      .subscribe({
        next: async (handler) => {
          await handler();
        },
        error: (err) => {
          console.log('command bus error', err);
          this.logger.error(err);
        },
        complete: () => {
          this.logger.debug('Command bus completed');
        },
      });
  }

  subscribe<T extends CommandMessage>(definition: CommandHandlerDefinition): Registration {
    const { commandName } = definition;

    this.logger.debug(`Registering command handler for [${commandName}]`);
    assertNonNull(definition, 'handler cannot be null');

    this.handlers[commandName] = this.handlers[commandName] || [];
    this.handlers[commandName].push(definition);

    return () => this.handlers[commandName].splice(this.handlers[commandName].indexOf(definition), 1);
  }

  async dispatch<C>(command: CommandMessage<C>): Promise<void> {
    this.logger.debug(`Dispatching command [${command.commandName}]`);

    if (!isCommandMessage(command)) {
      throw new Error('Command is not a CommandMessage');
    }

    await this.messageBus.publish(command);
  }

  private getHandlers(commandName: string): Array<CommandHandlerDefinition> {
    return this.handlers[commandName] || [];
  }

  private async handle(command: CommandMessage<any>, handler: CommandHandlerDefinition) {
    const unitOfWork = this.unitOfWorkFactory.create(command);

    try {
      this.logger.debug(`Executing command handler for [${command.commandName}]`);
      const result = await unitOfWork.execute(() => handler.handleCallback(command));
      const commandResultMessage = asCommandResultMessage(command.messageId, result);
      this.logger.debug(`Publishing CommandResult for [${command.commandName}]`);
      await this.messageBus.publish(commandResultMessage);
    } catch (err: any) {
      this.logger.debug(`Execution failed for [${command.commandName}]: ${err.toString()}`);
      const error = err instanceof Error ? err : new Error((err as any)?.toString());
      const commandResultMessage = asCommandResultMessage(command.messageId, error);
      await this.messageBus.publish(commandResultMessage);
    }
  }
}
