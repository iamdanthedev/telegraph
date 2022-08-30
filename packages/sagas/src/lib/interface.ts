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

export interface SagaStep<Command, Phase, State> {
  transitionTo: Phase;
  invoke(
    context: SagaStepContext<Command, State>
  ): MaybeAsync<CommandMessageInput>;
  compensate?(context: SagaStepContext<Command, State>): Promise<any> | void;
  onReply?(
    eventName: string,
    event: SagaEventMessage,
    context: SagaStepContext<Command, State>
  ): Promise<any> | void;
}

export interface SagaStepContext<Command, State> {
  state: State;
  setState(value: State): void;
  initialCommand: Command;
}

export interface SagaInstanceMetadata<Command, Phase> {
  initialCommand?: Command;
}

export interface SagaInstanceState {
  sagaId: string;
  sagaInstanceId: string;
  metadata: SagaInstanceMetadata<any, any>;
  state: Record<string, any>;
}

export interface ISagaCommandPublisher {
  publish: CommandBus['publish'];
}

export interface SagaInstanceEvent<T> {
  sagaId: string;
  sagaInstanceId: string;
  transitionedTo: T;
}
