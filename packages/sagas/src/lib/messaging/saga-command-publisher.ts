import { Observer } from 'rxjs';
import {
  CommandBus,
  CommandResultMessage,
  ILoggerFactory,
  Logger,
  MessageMetadata,
} from '@telegraph/core';
import { ISagaCommandPublisher, SagaInstanceDescription } from '../interface';

export class SagaCommandPublisher implements ISagaCommandPublisher {
  private readonly logger: Logger;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly sagaInstanceDescription: SagaInstanceDescription,
    private readonly loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.create(
      `SagaCommandPublisher [${sagaInstanceDescription.sagaId}]`
    );
  }

  publish<T = unknown, R = unknown>(commandName: string, payload: T): void;
  publish<T = unknown, R = unknown>(
    commandName: string,
    payload: T,
    metadata: MessageMetadata
  ): void;
  publish<T = unknown, R = unknown>(
    commandName: string,
    payload: T,
    metadata: MessageMetadata,
    observer: Partial<Observer<CommandResultMessage<R>>>
  ): void;
  publish<T = unknown, R = unknown>(
    commandName: string,
    payload: T,
    metadata?: MessageMetadata,
    observer?: Partial<Observer<CommandResultMessage<R>>>
  ): void {
    metadata = metadata || {};

    metadata['sagaId'] = this.sagaInstanceDescription.sagaId;
    metadata['sagaInstanceId'] = this.sagaInstanceDescription.sagaInstanceId;

    this.commandBus.publish(commandName, payload, metadata, observer);
  }
}
