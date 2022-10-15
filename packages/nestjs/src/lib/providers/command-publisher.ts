import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { CommandMessage, MessageType, TelegraphContext } from '@telegraph/core';
import { COMMAND_METADATA } from '../decorators/constants';
import { CommandMetadata } from "../decorators/command-handler.decorator";

@Injectable()
export class CommandPublisher {
  async publish<T extends {}>(command: T): Promise<CommandMessage<T>> {
    const metadata: CommandMetadata = Reflect.getMetadata(COMMAND_METADATA, (command as any).constructor);

    if (!metadata) {
      throw new Error(`Command ${command.constructor.name} is not registered`);
    }

    const eventMessage: CommandMessage<T> = {
      commandName: metadata.commandName,
      type: MessageType.Command,
      messageId: uuid.v4(),
      metadata: {},
      payload: command,
    };

    await TelegraphContext.commandBus.dispatch(eventMessage);

    return eventMessage;
  }
}
