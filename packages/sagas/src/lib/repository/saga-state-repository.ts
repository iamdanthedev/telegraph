import { AssociationValue } from '../association/association-value';
import { SagaState } from './saga-state';

export interface SagaStateRepository {
  init(): Promise<void>;

  /**
   * Load a list of saga states but association value
   * @param sagaId
   * @param associationValue
   */
  find(sagaId: string, associationValue: AssociationValue): Promise<SagaState | null>;

  /**
   * Save saga state
   * @param state
   */
  save(state: SagaState): Promise<void>;
}
