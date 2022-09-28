import 'reflect-metadata';
import * as uuid from 'uuid';
import type { Class } from 'type-fest';
import { COMMAND_METADATA, COMMAND_HANDLER_METADATA, commandHandlerDescriptorKey } from './constants';

export interface CommandHandlerDescriptor {
  id: string;
  commandName: string;
}

export function CommandHandler(command: Class<any>): ClassDecorator {
  return function (target: Function) {
    if (!Reflect.hasMetadata(COMMAND_METADATA, command)) {
      Reflect.defineMetadata(COMMAND_METADATA, { id: uuid.v4(), name: command.name }, command);
    }

    const descriptor: CommandHandlerDescriptor = {
      id: uuid.v4(),
      commandName: command.name,
    };

    Object.defineProperty(target, commandHandlerDescriptorKey, {
      value: descriptor,
    });

    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
  };
}

export function isTelegraphCommandHandler(target: any): target is Function {
  return target instanceof Function && Reflect.hasMetadata(COMMAND_HANDLER_METADATA, target);
}

export function getCommandHandlerDescriptor(target: Function) {
  return (target as any)[commandHandlerDescriptorKey] as CommandHandlerDescriptor;
}
