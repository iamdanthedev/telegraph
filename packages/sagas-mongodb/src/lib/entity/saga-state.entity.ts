import { ObjectId } from 'mongodb';
import { AssociationValue, SagaState, SagaStateValue } from '@telegraph/sagas';

export interface SagaStateEntity {
  _id: string;
  sagaId: string;
  state: SagaStateValue;
  associationValues: AssociationValue[];
  completed: boolean;
  revision: number;
  createdAt: Date;
  updatedAt: Date;
}
