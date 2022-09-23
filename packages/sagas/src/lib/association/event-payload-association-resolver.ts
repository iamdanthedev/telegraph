import { EventMessage } from '@telegraph/core';
import { AssociationResolver } from './association-resolver';

export class EventPayloadAssociationResolver<T extends Record<string, any>> implements AssociationResolver {
  constructor(private readonly propertyName: keyof T) {}

  validate(event: EventMessage<T>): boolean {
    return !!event.payload.hasOwnProperty(this.propertyName);
  }

  resolve(event: EventMessage<T>) {
    return event.payload[this.propertyName];
  }
}
