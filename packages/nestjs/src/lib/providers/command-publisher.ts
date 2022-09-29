import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { CommandMessage, MessageType, TelegraphContext } from '@telegraph/core';
import { COMMAND_METADATA } from '../decorators/constants';

@Injectable()
export class CommandPublisher {
  async publish<T extends {}>(command: T): Promise<CommandMessage<T>> {
    const metadata = Reflect.getMetadata(COMMAND_METADATA, command);

    if (!metadata) {
      throw new Error(`Command ${command.constructor.name} is not registered`);
    }

    const eventMessage: CommandMessage<T> = {
      commandName: metadata.name,
      type: MessageType.Command,
      messageId: uuid.v4(),
      metadata: {},
      payload: command,
    };

    await TelegraphContext.commandBus.dispatch(eventMessage);

    return eventMessage;
  }
}
