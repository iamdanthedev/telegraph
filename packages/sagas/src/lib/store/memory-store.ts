import { ISagaStore } from './saga-store';
import { SagaInstanceState } from '../interface';

export class MemoryStore implements ISagaStore {
  private store: Map<string, SagaInstanceState> = new Map();

  get(sagaInstanceId: string): Promise<SagaInstanceState | undefined> {
    return Promise.resolve(this.store.get(sagaInstanceId));
  }

  set(sagaInstanceId: string, data: SagaInstanceState): Promise<void> {
    this.store.set(sagaInstanceId, data);
    return Promise.resolve();
  }
}
