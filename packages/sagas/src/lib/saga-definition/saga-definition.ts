import { EventMessage, Logger } from '@telegraph/core';
import { AssociationResolver } from "../association/association-resolver";
import { SagaStateValue } from "../repository/saga-state";

export interface SagaEventHandlerCallbackParams<State extends SagaStateValue = SagaStateValue> {
  event: EventMessage;
  state: State;
}

export interface SagaEventHandlerDefinition<State extends SagaStateValue = SagaStateValue> {
  sagaId: string;
  eventName: string;
  sagaStart: boolean;
  sagaEnd: boolean;
  initialState?: State; // only if sagaStart is true
  associationResolver?: AssociationResolver;
  callback(params: SagaEventHandlerCallbackParams<State>): Promise<void>;
}
