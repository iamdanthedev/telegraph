import { EventMessage } from '@telegraph/core';

export interface IEventHandler<T> {
  handle(event: T, message: EventMessage<T>): Promise<void>;
}
