import { SagaStateValue } from "@telegraph/sagas";

export interface ISaga<State extends SagaStateValue> {
  state: SagaStateValue;
}
