import { filter, mergeMap, Observable, Subject } from 'rxjs';
import * as uuid from 'uuid';
import { LoggerFactory, TelegraphContext } from '@telegraph/core';
import { AssociationResolver } from './association/association-resolver';
import { SagaInstanceDescription } from './saga-instance-description';
import { SagaDefinition, SagaEventHandlerDescriptor } from './saga-definition/saga-definition';
import { ISagaStore } from './store/saga-store';
import { SagaInstance } from './runner/saga-instance';

export class SagaManager {
  private logger = TelegraphContext.loggerFactory.create("SagaManager");

  private definitions: Record<string, SagaDefinition> = {};
  private sagaInstances: Record<string, SagaInstance<any, any, any>> = {};
  private associationResolverMap: Array<{ resolver: AssociationResolver; sagaDefinition: SagaDefinition }> = [];

  private knownEventNames: string[] = []; // fixme: find a more efficient implementation
  private handlersByEventName: Record<string, Array<SagaEventHandlerDescriptor>> = {};

  constructor(private readonly store: ISagaStore, private readonly loggerFactory: LoggerFactory) {
    this.initialize();
  }

  register(definition: SagaDefinition): void {
    const { sagaId } = definition;

    if (this.definitions[sagaId]) {
      throw new Error(`Saga with id ${sagaId} already registered`);
    }

    const resolvers = definition.handlers.map((x) => x.associationResolver);

    this.definitions[sagaId] = definition;

    resolvers.forEach((resolver) => {
      this.associationResolverMap.push({
        resolver,
        sagaDefinition: definition,
      });
    });

    definition.handlers.forEach((handler) => {
      this.knownEventNames.push(handler.eventName);

      this.handlersByEventName[handler.eventName] = this.handlersByEventName[handler.eventName] || [];
      this.handlersByEventName[handler.eventName].push(handler);
    });
  }

  initialize() {
    TelegraphContext.eventBus.asObservable().pipe(
      filter((x) => this.knownEventNames.includes(x.eventName)),
      mergeMap((x) => this.handlersByEventName[x.eventName].map((handler) => ({ handler, message: x })))
    )
      .subscribe({
        next: async ({ handler, message }) => {
          // instantiate handler
          // run handler
        },
        error: (err) => {
          // fixme: what to do here?
          this.logger.error(err);
        }
      });
  }

  async instantiate<Command = any, Phase = any, State = any>(
    sagaId: string
  ): Promise<SagaInstance<Command, Phase, State>> {
    const definition = this.definitions[sagaId];
    const sagaInstanceId = uuid.v4();

    if (!definition) {
      throw new Error('saga definition not found');
    }

    await this.store.set(sagaInstanceId, {
      sagaId,
      sagaInstanceId,
      initialCommand: null,
      state: {},
      metadata: {},
    });

    return this.createSagaInstance<Command, Phase, State>({
      sagaId,
      sagaInstanceId,
    });
  }

  run<T>(sagaId: string, payload: T): Observable<SagaInstanceEvent<any>> {
    const controller = this.createSagaInstance(sagaId);
    return controller.getSubject().asObservable();
  }

  private getSagaInstance(instanceId: string): SagaInstance<any, any, any> {
    return this.sagaInstances[instanceId];
  }

  private async createSagaInstance<Command = any, Phase = any, State = any>(
    sagaId: string
  ): Promise<SagaInstance<any, any, any>> {
    const definition = this.definitions[sagaId];

    if (!definition) {
      throw new Error(`Saga with id ${sagaId} not registered`);
    }

    const subject = this.createSagaSubject();

    const description = new SagaInstanceDescription(sagaId, uuid.v4());

    const commandPublisher = new SagaCommandPublisher(this.context.commandBus, description, this.loggerFactory);

    const initialState = {
      sagaId,
      sagaInstanceId: description.sagaInstanceId,
      initialCommand: null,
      state: {},
      metadata: {},
    };

    await this.store.set(description.sagaInstanceId, initialState);

    return new SagaInstance<Command, Phase, State>(definition, commandPublisher, subject, state, this.loggerFactory);
  }

  private async loadSagaInstance<Command = any, Phase = any, State = any>(
    description: SagaInstanceDescription
  ): Promise<SagaInstance<any, any, any>> {
    const definition = this.definitions[description.sagaId];

    if (!definition) {
      throw new Error(`Saga with id ${description.sagaId} not registered`);
    }

    const subject = this.createSagaSubject();

    const commandPublisher = new SagaCommandPublisher(this.context.commandBus, description, this.loggerFactory);

    const state = await this.store.get(description.sagaInstanceId);

    return new SagaInstance<Command, Phase, State>(definition, commandPublisher, subject, state, this.loggerFactory);
  }

  private createSagaSubject(): Subject<SagaInstanceEvent<any>> {
    return new Subject<SagaInstanceEvent<any>>();
  }

  private execute(message: SagaEventMessage<any>) {
    const definition = this.definitions[message.sagaId];
    const subject = this.sagaSubjects[message.sagaId];

    if (!definition) {
      return;
    }

    const sagaState = this.store.get(message.sagaInstanceId);
    const sagaInstance = new SagaController(definition, subject, sagaState, this.context);
  }
}
