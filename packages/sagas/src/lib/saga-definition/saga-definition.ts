import { EventMessage } from '@telegraph/core';
import { AssociationResolver } from "../association/association-resolver";
import { SagaStateValue } from "../repository/saga-state";

export interface SagaEventHandlerContext {
  sagaId: string;
  sagaInstanceId: string;
}

export interface SagaDefinition<State extends SagaStateValue = SagaStateValue> {
  sagaId: string;
  initialState: State;
  handlers: Array<SagaEventHandlerDescriptor>;
}

export interface SagaEventHandlerDescriptor<State extends SagaStateValue = SagaStateValue> {
  sagaId: string;
  eventName: string;
  sagaStart: boolean;
  sagaEnd: boolean;
  associationResolver: AssociationResolver;
  callback(event: EventMessage, state: State, context: SagaEventHandlerContext): Promise<void>;
}

