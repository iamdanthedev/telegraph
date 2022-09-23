export type SagaStateValue = Record<string, any>;

export interface SagaState<T extends SagaStateValue = SagaStateValue> {
  sagaInstanceId: string;
  sagaId: string;
  revision: number;
  state: T;
}
