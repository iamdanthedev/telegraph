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
  CommandHandlerMetadata,
  EventHandlerMetadata,
  ICommandHandler,
  IEventHandler,
  isTelegraphCommandHandler,
  SagaMetadata,
} from '@telegraph/nestjs';
import { COMMAND_HANDLER_METADATA, EVENT_HANDLER_METADATA, SAGA_METADATA } from '../decorators/constants';

@Injectable()
export class ExplorerService {
  private commandHandlers: Array<{ metadata: CommandHandlerMetadata; instanceWrapper: InstanceWrapper }> = [];
  private eventHandlers: Array<{ metadata: EventHandlerMetadata; instanceWrapper: InstanceWrapper }> = [];
  private sagas: Array<{ metadata: SagaMetadata; instanceWrapper: InstanceWrapper }> = [];

  constructor(private readonly discovery: DiscoveryService, private readonly moduleRef: ModuleRef) {
    this.scan();
  }

  registerEventHandlers() {
    this.eventHandlers.forEach(({ metadata, instanceWrapper }) => {
      const instance: IEventHandler<any> = this.moduleRef.get(instanceWrapper.token, { strict: false });

      if (!instance) {
        return; // fixme: should log error?
      }

      const definition: EventHandlerDefinition = {
        eventName: metadata.eventName,
        canHandleCallback: (message: EventMessage) => {
          return message.eventName === metadata.eventName;
        },
        handleCallback: async (message: EventMessage) => {
          await instance.handle(message.payload, message);
        },
      };

      TelegraphContext.eventBus.subscribe(definition);
    });
  }

  registerCommandHandlers() {
    this.commandHandlers.forEach(({ metadata, instanceWrapper}) => {
      const instance: ICommandHandler<any> = this.moduleRef.get(instanceWrapper.token, { strict: false });

      if (!instance) {
        return; // fixme: log error?
      }

      const definition: CommandHandlerDefinition = {
        commandName: metadata.commandName,
        canHandleCallback: (message: CommandMessage) => {
          return message.commandName === metadata.commandName;
        },
        handleCallback: async (message: CommandMessage) => {
          await instance.handle(message.payload, message);
        },
      };

      TelegraphContext.commandBus.subscribe(definition);
    });
  }

  registerSagas() {
    this.sagas.forEach(({metadata, instanceWrapper}) => {

    })
  }

  private scan() {
    const providers = this.discovery.getProviders();

    providers
      .filter((x) => isTelegraphCommandHandler(x.token))
      .forEach((provider) => {
        const eventHandlerMeta: EventHandlerMetadata = Reflect.getMetadata(EVENT_HANDLER_METADATA, provider.token);
        const commandHandlerMeta: CommandHandlerMetadata = Reflect.getMetadata(
          COMMAND_HANDLER_METADATA,
          provider.token
        );
        const sagaMeta: SagaMetadata = Reflect.getMetadata(SAGA_METADATA, provider.token);

        if (eventHandlerMeta) {
          const existing = this.eventHandlers.find((x) => x.metadata.id === eventHandlerMeta.id);

          if (!existing) {
            this.eventHandlers.push({ metadata: eventHandlerMeta, instanceWrapper: provider });
          }
        }

        if (commandHandlerMeta) {
          const existing = this.commandHandlers.find((x) => x.metadata.id === commandHandlerMeta.id);

          if (!existing) {
            this.commandHandlers.push({ metadata: commandHandlerMeta, instanceWrapper: provider });
          }
        }

        if (sagaMeta) {
          const existing = this.sagas.find((x) => x.metadata.id === sagaMeta.id);

          if (!existing) {
            this.sagas.push({ metadata: sagaMeta, instanceWrapper: provider });
          }
        }
      });
  }
}
