import { EventMessage, Logger } from '@telegraph/core';
import { SagaEventHandlerDefinition } from '../saga-definition/saga-definition';
import { AssociationValue } from '../association/association-value';
import { SagaState } from '../repository/saga-state';

export class SagaEventHandlerInstance {
  constructor(
    private readonly definition: SagaEventHandlerDefinition,
    private readonly association: AssociationValue | undefined,
    private readonly eventMessage: EventMessage,
    private readonly state: SagaState,
    private readonly logger: Logger
  ) {}

  async handle(event: EventMessage): Promise<SagaState> {
    await this.definition.callback({ event: this.eventMessage, state: this.state.state });
    return this.state;
  }
}
