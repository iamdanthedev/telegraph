import { Message } from '@telegraph/core';

export interface AssociationResolver {
  validate(event: Message): boolean;
  resolve(event: Message): any;
}
