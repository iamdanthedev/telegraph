import { Injectable } from '@nestjs/common';
import { DiscoveryService, ModuleRef } from '@nestjs/core';
import {
  CommandHandlerDefinition,
  CommandMessage,
  EventHandlerDefinition,
  EventMessage,
  TelegraphContext,
} from '@telegraph/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import {
  getCommandHandlerDescriptor,
  getEventHandlerDescriptor,
  ICommandHandler,
  IEventHandler,
  isTelegraphCommandHandler,
} from '@telegraph/nestjs';
import {
  COMMAND_HANDLER_METADATA,
  EVENT_HANDLER_METADATA,
  telegraphCommandHandlerDescriptor,
  telegraphEventHandlerDescriptor,
} from '../decorators/constants';

@Injectable()
export class ExplorerService {
  private commandHandlers: InstanceWrapper[] = [];
  private eventHandlers: InstanceWrapper[] = [];

  constructor(private readonly discovery: DiscoveryService, private readonly moduleRef: ModuleRef) {
    this.scan();
  }

  registerEventHandlers() {
    this.eventHandlers.forEach((eventHandler) => {
      const descriptor = getEventHandlerDescriptor(eventHandler.token as Function);
      const instance: IEventHandler<any> = this.moduleRef.get(eventHandler.token, { strict: false });

      if (!instance) {
        // fixme: log error?
        return;
      }

      const definition: EventHandlerDefinition = {
        eventName: descriptor.eventName,
        canHandleCallback: (message: EventMessage) => {
          return message.eventName === descriptor.eventName;
        },
        handleCallback: async (message: EventMessage) => {
          await instance.handle(message.payload, message);
        },
      };
    });
  }

  registerCommandHandlers() {
    this.commandHandlers.forEach((commandHandler) => {
      const descriptor = getCommandHandlerDescriptor(commandHandler.token as Function);
      const instance: ICommandHandler<any> = this.moduleRef.get(commandHandler.token, { strict: false });

      if (!instance) {
        // fixme: log error?
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
            (x) =>
              (x.token as any)[telegraphEventHandlerDescriptor].id ===
              (provider.token as any)[telegraphEventHandlerDescriptor].id
          );

          if (!existing) {
            this.eventHandlers.push(provider);
          }
        }

        if (commandHandlerMeta) {
          const existing = this.commandHandlers.find(
            (x) =>
              (x.token as any)[telegraphCommandHandlerDescriptor].id ===
              (provider.token as any)[telegraphCommandHandlerDescriptor].id
          );

          if (!existing) {
            this.commandHandlers.push(provider);
          }
        }
      });
  }
}
