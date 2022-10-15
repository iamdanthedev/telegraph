import { filter, from, mergeMap } from 'rxjs';
import { Injectable, Optional } from '@nestjs/common';
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
  isSaga,
  isTelegraphCommandHandler,
  isTelegraphEventHandler,
  SagaEndMetadata,
  SagaEventHandlerMetadata,
  SagaMetadata,
  SagaStartMetadata,
} from '@telegraph/nestjs';
import {
  COMMAND_HANDLER_METADATA,
  EVENT_HANDLER_METADATA,
  SAGA_END_METADATA,
  SAGA_EVENT_HANDLER,
  SAGA_METADATA,
  SAGA_START_METADATA,
} from '../decorators/constants';
import { EventPayloadAssociationResolver, SagaEventHandlerDefinition, SagaManager } from '@telegraph/sagas';

@Injectable()
export class ExplorerService {
  private commandHandlers: Array<{ metadata: CommandHandlerMetadata; instanceWrapper: InstanceWrapper }> = [];
  private eventHandlers: Array<{ metadata: EventHandlerMetadata; instanceWrapper: InstanceWrapper }> = [];
  private sagas: Array<{ metadata: SagaMetadata; instanceWrapper: InstanceWrapper }> = [];

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly moduleRef: ModuleRef,
    @Optional() private readonly sagaManager: SagaManager
  ) {
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
    this.commandHandlers.forEach(({ metadata, instanceWrapper }) => {
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
    this.sagas.forEach(({ metadata, instanceWrapper }) => {
      console.log('registering saga', metadata.id);

      // fixme: assert saga has start and end

      metadata.eventHandlers.forEach(({ propertyName }) => {
        const sagaEventHandlerMetadata: SagaEventHandlerMetadata | null = Reflect.getMetadata(
          SAGA_EVENT_HANDLER,
          (instanceWrapper.token as any).prototype,
          propertyName
        );
        const sagaStartMetadata: SagaStartMetadata | null = Reflect.getMetadata(
          SAGA_START_METADATA,
          (instanceWrapper.token as any).prototype,
          propertyName
        );
        const sagaEndMetadata: SagaEndMetadata | null = Reflect.getMetadata(
          SAGA_END_METADATA,
          (instanceWrapper.token as any).prototype,
          propertyName
        );

        if (!sagaEventHandlerMetadata && sagaStartMetadata) {
          throw new Error(`Saga ${metadata.sagaId} has a start method but no event handler metadata`);
        }

        if (!sagaEventHandlerMetadata && sagaEndMetadata) {
          throw new Error(`Saga ${metadata.sagaId} has an end method but no event handler metadata`);
        }

        if (!sagaEventHandlerMetadata) {
          return;
        }

        const definition: SagaEventHandlerDefinition = {
          sagaId: metadata.sagaId,
          eventName: sagaEventHandlerMetadata.eventName,
          sagaStart: !!sagaStartMetadata,
          sagaEnd: !!sagaEndMetadata,
          initialState: sagaStartMetadata?.initialState, // only if sagaStart is true
          associationResolver: new EventPayloadAssociationResolver(sagaEventHandlerMetadata.associationField),
          callback: async (params) => {
            const instance: any = this.moduleRef.get(instanceWrapper.token, { strict: false });
            instance.state = params.state;
            instance[propertyName](params.event.payload, params.event);

            console.log('saga event handler callback', params);
          },
        };

        this.sagaManager.register(definition);
      });
    });
  }

  private scan() {
    const providers = this.discovery.getProviders();

    providers.forEach((provider) => {
      if (isTelegraphCommandHandler(provider.token)) {
        const metadata = Reflect.getMetadata(COMMAND_HANDLER_METADATA, provider.token);

        if (metadata) {
          const existing = this.commandHandlers.find((x) => x.metadata.id === metadata.id);

          if (!existing) {
            this.commandHandlers.push({ metadata, instanceWrapper: provider });
          }
        }
      }

      if (isTelegraphEventHandler(provider.token)) {
        const metadata = Reflect.getMetadata(EVENT_HANDLER_METADATA, provider.token);

        if (metadata) {
          const existing = this.eventHandlers.find((x) => x.metadata.id === metadata.id);

          if (!existing) {
            this.eventHandlers.push({ metadata, instanceWrapper: provider });
          }
        }
      }

      if (isSaga(provider.token)) {
        const metadata = Reflect.getMetadata(SAGA_METADATA, provider.token);

        if (metadata) {
          const existing = this.sagas.find((x) => x.metadata.id === metadata.id);

          if (!existing) {
            this.sagas.push({ metadata, instanceWrapper: provider });
          }
        }
      }
    });
  }
}
