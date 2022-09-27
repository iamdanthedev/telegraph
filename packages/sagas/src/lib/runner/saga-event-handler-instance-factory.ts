import { EventMessage, TelegraphContext } from '@telegraph/core';
import { SagaEventHandlerInstance } from './saga-event-handler-instance';
import { SagaEventHandlerDefinition } from '../saga-definition/saga-definition';
import { SagaState } from '../repository/saga-state';
import { AssociationValue } from '../association/association-value';

export class SagaEventHandlerInstanceFactory {
  getInstance(
    definition: SagaEventHandlerDefinition,
    associationValue: AssociationValue,
    event: EventMessage,
    state: SagaState
  ): SagaEventHandlerInstance {
    const logger = TelegraphContext.loggerFactory.create(`${definition.sagaId}::${definition.eventName}`);

    return new SagaEventHandlerInstance(definition, associationValue, event, state, logger);
  }
}
