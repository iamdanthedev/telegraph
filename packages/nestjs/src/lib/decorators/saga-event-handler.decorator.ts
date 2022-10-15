import 'reflect-metadata';
import * as uuid from 'uuid';
import type { Class } from 'type-fest';
import { EVENT_METADATA, SAGA_EVENT_HANDLER } from './constants';
import { EventMetadata } from './event-handler.decorator';

export interface SagaEventHandlerMetadata {
  id: string;
  sagaId: string;
  eventName: string;
  associationField: string;
}

export interface SagaEventHandlerOptions {
  associationField: string;
}

export function SagaEventHandler(event: Class<any>, options: SagaEventHandlerOptions) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    if (!Reflect.hasMetadata(EVENT_METADATA, event)) {
      const eventMetadata: EventMetadata = {
        id: uuid.v4(),
        eventName: event.name,
      };

      Reflect.defineMetadata(EVENT_METADATA, eventMetadata, event);
    }

    if (!Reflect.hasMetadata(SAGA_EVENT_HANDLER, target, key)) {
      const metadata: SagaEventHandlerMetadata = {
        id: uuid.v4(),
        sagaId: target.constructor.name,
        eventName: event.name,
        associationField: options.associationField,
      };

      Reflect.defineMetadata(SAGA_EVENT_HANDLER, metadata, target, key);
    }
  };
}
