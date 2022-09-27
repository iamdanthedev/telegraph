import { EventMessage } from '@telegraph/core';
import { AssociationResolver } from './association-resolver';
import { AssociationValue } from './association-value';

export class EventPayloadAssociationResolver<T extends Record<string, any>> implements AssociationResolver {
  constructor(private readonly propertyName: keyof T) {}

  validate(event: EventMessage<T>): boolean {
    return event.payload.hasOwnProperty(this.propertyName);
  }

  resolve(event: EventMessage<T>): AssociationValue {
    return {
      key: this.propertyName as string,
      value: event.payload[this.propertyName],
    };
  }
}
