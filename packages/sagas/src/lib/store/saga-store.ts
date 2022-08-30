import { SagaInstanceState } from '../interface';

export interface ISagaStore {
  get(sagaInstanceId: string): Promise<SagaInstanceState | undefined>;
  set(sagaInstanceId: string, data: SagaInstanceState): Promise<void>;
}
