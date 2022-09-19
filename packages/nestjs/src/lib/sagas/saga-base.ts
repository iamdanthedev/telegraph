import { CommandBus } from "@telegraph/core";

export abstract class SagaBase<State> {
  state: State;

  constructor(state: State) {
    this.state = state;
  }

  associateProperty(fieldId: string, value: string | number) {
    throw new Error('Not implemented');
  }
}

