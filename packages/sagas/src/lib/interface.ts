import { CommandBus, CommandMessageInput, EventMessage } from '@telegraph/core';
import { SagaEventMessage } from './messaging/saga-event-message';

export type MaybeAsync<T> = T | Promise<T>;

// todo: add version field?
export class SagaInstanceDescription {
  constructor(
    public readonly sagaId: string,
    public readonly sagaInstanceId: string
  ) {}
}

export interface SagaDefinition<Command, Phase, State> {
  sagaId: string;
  initialState: State;
  steps: Array<SagaStep<Command, Phase, State>>;
}

export interface OnReplyCallback {
  eventName: string;
  invoke(event: SagaEventMessage, context: SagaStepContext<any, any>): Promise<any> | void;
}

export interface

export interface SagaStep<Command, Phase, State> {
  transitionTo: Phase;
  invoke(
    context: SagaStepContext<Command, State>
  ): MaybeAsync<CommandMessageInput>;
  compensate?(context: SagaStepContext<Command, State>): Promise<any> | void;
  onReplyCallbacks?: Array<OnReplyCallback>;
}

export interface SagaStepContext<Command, State> {
  state: State;
  setState(value: State): void;
  initialCommand: Command;
}

export interface SagaInstanceMetadata<Command, Phase> {
  initialCommand?: Command;
}

export interface SagaInstanceState<T = object> {
  sagaId: string;
  sagaInstanceId: string;
  metadata: SagaInstanceMetadata<any, any>;
  initialCommand: object | null;
  payload: T;
}

export interface ISagaCommandPublisher {
  publish: CommandBus['publish'];
}

export interface SagaInstanceEvent<T> {
  sagaId: string;
  sagaInstanceId: string;
  transitionedTo: T;
}
