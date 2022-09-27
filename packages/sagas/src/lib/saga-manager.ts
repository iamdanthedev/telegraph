import { filter, mergeMap, map } from 'rxjs';
import * as uuid from 'uuid';
import { EventMessage, LoggerFactory, TelegraphContext, UnitOfWorkFactory } from '@telegraph/core';
import { SagaEventHandlerDefinition } from './saga-definition/saga-definition';
import { SagaEventHandlerInstanceFactory } from './runner/saga-event-handler-instance-factory';
import { AssociationValue } from './association/association-value';
import { SagaState } from './repository/saga-state';
import { SagaStateRepository } from './repository/saga-state-repository';

export class SagaManager {
  private logger = TelegraphContext.loggerFactory.create('SagaManager');

  private definitionsByEvent: Record<string, SagaEventHandlerDefinition[]> = {};
  private knownEventNames: string[] = []; // fixme: find a more efficient implementation

  constructor(
    private readonly loggerFactory: LoggerFactory,
    private readonly sagaInstanceFactory: SagaEventHandlerInstanceFactory,
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly stateRepository: SagaStateRepository
  ) {
    this.initialize();
  }

  initialize() {
    TelegraphContext.eventBus
      .asObservable()
      .pipe(
        filter((x) => this.knownEventNames.includes(x.eventName)),
        mergeMap((x) => this.definitionsByEvent[x.eventName].map((definition) => ({ message: x, definition }))),
        filter((x) => x.definition.associationResolver.validate(x.message)),
        map((x) => ({
          ...x,
          association: x.definition.associationResolver.resolve(x.message),
        }))
        // distinct((x) => x.message.eventName + x.definition.sagaId)
      )
      .subscribe({
        next: async ({ definition, message, association }) => {
          await this.handle(definition, message, association);
        },
        error: (err) => {
          // fixme: what to do here?
          this.logger.error(err);
        },
      });
  }

  register(definition: SagaEventHandlerDefinition): void {
    this.definitionsByEvent[definition.eventName] = this.definitionsByEvent[definition.eventName] || [];
    this.definitionsByEvent[definition.eventName].push(definition);
    this.knownEventNames.push(definition.eventName);
  }

  async handle(definition: SagaEventHandlerDefinition, event: EventMessage, associationValue: AssociationValue) {
    const unitOfWork = this.unitOfWorkFactory.create(event);
    const state = await this.getSagaState(definition, associationValue);

    const handler = await this.sagaInstanceFactory.getInstance(definition, associationValue, event, state);

    try {
      unitOfWork.start();
      await unitOfWork.execute(async () => {
        const updatedState = await handler.handle(event);
        await this.stateRepository.save(updatedState);
      });
    } catch (err) {
      this.logger.error('Error while handling saga event', err);
    }
  }

  private async getSagaState(
    definition: SagaEventHandlerDefinition,
    associationValue: AssociationValue
  ): Promise<SagaState> {
    if (definition.sagaStart) {
      if (!definition.initialState) {
        throw new Error('initialState must be defined for sagaStart');
      }

      const envelope: SagaState = {
        sagaId: definition.sagaId,
        sagaInstanceId: uuid.v4(),
        revision: 0, // fixme ?
        state: definition.initialState,
      };

      return Promise.resolve(envelope);
    }

    const state = await this.stateRepository.find(definition.sagaId, associationValue);

    if (!state) {
      throw new Error(
        `Saga state not found. Saga Id: ${definition.sagaId}, association: ${JSON.stringify(associationValue)}`
      );
    }

    return state;
  }
}
