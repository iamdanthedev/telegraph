import { ObjectId } from 'mongodb';
import { AssociationValue, SagaState, SagaStateValue } from '@telegraph/sagas';

export interface SagaStateEntity {
  _id: string;
  sagaId: string;
  state: SagaStateValue;
  associationValues: AssociationValue[];
  revision: number;
  createdAt: Date;
  updatedAt: Date;
}
