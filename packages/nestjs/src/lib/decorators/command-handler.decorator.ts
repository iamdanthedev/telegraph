import 'reflect-metadata';
import * as uuid from 'uuid';
import type { Class } from 'type-fest';
import { COMMAND_METADATA, COMMAND_HANDLER_METADATA } from './constants';

export interface CommandMetadata {
  id: string;
  commandName: string;
}

export interface CommandHandlerMetadata {
  id: string;
  commandName: string;
}

export function CommandHandler(command: Class<any>): ClassDecorator {
  return function (target: Function) {
    if (!Reflect.hasMetadata(COMMAND_METADATA, command)) {
      const commandMetadata: CommandMetadata = {
        id: uuid.v4(),
        commandName: command.name,
      };

      Reflect.defineMetadata(COMMAND_METADATA, commandMetadata, command);
    }

    const handlerMetadata: CommandHandlerMetadata = {
      id: uuid.v4(),
      commandName: command.name,
    };

    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, handlerMetadata, target);
  };
}

export function isTelegraphCommandHandler(target: any): target is Function {
  return target instanceof Function && Reflect.hasMetadata(COMMAND_HANDLER_METADATA, target);
}
