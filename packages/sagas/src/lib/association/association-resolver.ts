import { Message } from '@telegraph/core';
import { AssociationValue } from './association-value';

export interface AssociationResolver {
  validate(event: Message): boolean;
  resolve(event: Message): AssociationValue;
}
