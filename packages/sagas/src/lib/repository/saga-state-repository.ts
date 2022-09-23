import { AssociationValue } from '../association/association-value';
import { SagaState } from './saga-state';

export interface SagaStateRepository {
  /**
   * Load a list of saga states but association value
   * @param associationValue
   */
  find(associationValue: AssociationValue<any>): Promise<Array<SagaState>>;

  /**
   * Save saga state
   * @param state
   */
  save(state: SagaState): Promise<void>;
}
