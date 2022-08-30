import { filter, Observable, Subject } from 'rxjs';
import * as uuid from 'uuid';
import { ILoggerFactory, TelegraphContext } from '@telegraph/core';
import {
  SagaDefinition,
  SagaInstanceDescription,
  SagaInstanceEvent,
} from './interface';
import { ISagaStore } from './store/saga-store';
import {
  isSagaEventMessage,
  SagaEventMessage,
} from './messaging/saga-event-message';
import { SagaInstance } from './runner/saga-instance';
import { SagaCommandPublisher } from './messaging/saga-command-publisher';

export class SagaOrchestrator {
  private definitions: Record<string, SagaDefinition<any, any, any>> = {};
  private sagaInstances: Record<string, SagaInstance<any, any, any>> = {};

  constructor(
    private readonly context: TelegraphContext,
    private readonly store: ISagaStore,
    private readonly loggerFactory: ILoggerFactory
  ) {
    this.initialize();
  }

  initialize() {
    this.context.messageBus
      .asObservable()
      .pipe(filter(isSagaEventMessage))
      .subscribe((message) => this.execute(message));
  }

  register<Command, Phase, State>(
    definition: SagaDefinition<Command, Phase, State>
  ): void {
    const { sagaId } = definition;

    if (this.definitions[sagaId]) {
      throw new Error(`Saga with id ${sagaId} already registered`);
    }

    this.definitions[sagaId] = definition;
  }

  run<T>(sagaId: string, payload: T): Observable<SagaInstanceEvent<any>> {
    const controller = this.createSagaInstance(sagaId);
    return controller.getSubject().asObservable();
  }

  private getSagaInstance(instanceId: string): SagaInstance<any, any, any> {
    return this.sagaInstances[instanceId];
  }

  private async createSagaInstance(
    description: SagaInstanceDescription
  ): Promise<SagaInstance<any, any, any>> {
    const definition = this.definitions[description.sagaId];

    if (!definition) {
      throw new Error(`Saga with id ${description.sagaId} not registered`);
    }

    const subject = this.createSagaSubject();

    const commandPublisher = new SagaCommandPublisher(
      this.context.commandBus,
      description,
      this.loggerFactory
    );

    const state = await this.store.get(description.sagaInstanceId);

    return new SagaInstance(
      definition,
      commandPublisher,
      subject,
      state,
      this.loggerFactory
    );
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
    const sagaInstance = new SagaController(
      definition,
      subject,
      sagaState,
      this.context
    );
  }
}
