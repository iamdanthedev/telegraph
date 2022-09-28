import { Injectable } from '@nestjs/common';
import { DiscoveryService, ModuleRef } from '@nestjs/core';
import {
  COMMAND_HANDLER_METADATA,
  EVENT_HANDLER_METADATA,
  commandHandlerDescriptorKey,
  telegraphEventHandler,
} from '../decorators/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { getCommandHandlerDescriptor, ICommandHandler, isTelegraphCommandHandler } from '@telegraph/nestjs';
import { CommandHandlerDefinition, CommandMessage, TelegraphContext } from '@telegraph/core';

@Injectable()
export class ExplorerService {
  private commandHandlers: InstanceWrapper[] = [];
  private eventHandlers: InstanceWrapper[] = [];

  constructor(private readonly discovery: DiscoveryService, private readonly moduleRef: ModuleRef) {
    this.scan();
  }

  registerEventHandlers() {
    console.log(this.eventHandlers);
  }

  registerCommandHandlers() {
    this.commandHandlers.forEach((commandHandler) => {
      const descriptor = getCommandHandlerDescriptor(commandHandler.token as Function);

      const instance: ICommandHandler<any> = this.moduleRef.get(commandHandler.token, { strict: false });

      if (!instance) {
        return;
      }

      const definition: CommandHandlerDefinition = {
        commandName: descriptor.commandName,
        canHandleCallback: (message: CommandMessage) => {
          return message.commandName === descriptor.commandName;
        },
        handleCallback: async (message: CommandMessage) => {
          await instance.handle(message.payload, message);
        },
      };

      TelegraphContext.commandBus.subscribe(definition);
    });
  }

  private scan() {
    const providers = this.discovery.getProviders();

    providers
      .filter((x) => isTelegraphCommandHandler(x.token))
      .forEach((provider) => {
        const eventHandlerMeta = Reflect.getMetadata(EVENT_HANDLER_METADATA, provider.token);
        const commandHandlerMeta = Reflect.getMetadata(COMMAND_HANDLER_METADATA, provider.token);

        if (eventHandlerMeta) {
          const existing = this.eventHandlers.find(
            (x) => (x.token as any)[telegraphEventHandler].id === (provider.token as any)[telegraphEventHandler].id
          );

          if (!existing) {
            this.eventHandlers.push(provider);
          }
        }

        if (commandHandlerMeta) {
          const existing = this.commandHandlers.find(
            (x) =>
              (x.token as any)[commandHandlerDescriptorKey].id ===
              (provider.token as any)[commandHandlerDescriptorKey].id
          );

          if (!existing) {
            this.commandHandlers.push(provider);
          }
        }
      });
  }
}
