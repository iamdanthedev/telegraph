import { CommandBus } from './command-bus';
import { MessageBus } from '../messaging/message-bus';
import { CommandMessageFactory } from './command-message-factory';
import { LoggerFactory } from '../logging/logger-factory';
import { MessageMetadata } from '../messaging/message';
import { CommandResultListener } from './command-result-listener';
import { CommandResultMessage } from './command-result-message';

/**
 * CommandGateway is a convenience class that allows you to dispatch commands and listen for command results
 */
export class CommandGateway {
  constructor(
    private readonly messageBus: MessageBus,
    private readonly commandBus: CommandBus,
    private readonly loggerFactory: LoggerFactory
  ) {}

  dispatchAndWaitForResult<T, R>(
    commandName: string,
    payload: T,
    metadata?: MessageMetadata,
    options?: {
      timeout?: number;
    }
  ): Promise<CommandResultMessage<R>> {
    const command = CommandMessageFactory.create(commandName, payload, metadata);

    return new Promise<CommandResultMessage<R>>((resolve, reject) => {
      const listener = new CommandResultListener({
        command,
        timeout: options?.timeout ?? 10000,
        onMessage: resolve,
        onTimeout: () => {
          reject(new Error(`Command [${commandName}] timed out`));
        },
        onError: err => {
          reject(err);
        },
      });

      this.messageBus.registerListener(listener);

      this.commandBus.dispatch(command).catch((err) => {
        reject(err);
      });
    });
  }
}
