import 'reflect-metadata';
import * as uuid from 'uuid';
import { SAGA_EVENT_HANDLER, SAGA_METADATA } from './constants';

export interface SagaMetadata {
  id: string;
  sagaId: string;
  eventHandlers: Array<{
    propertyName: string;
  }>;
}

export function Saga() {
  return function (target: Function) {
    if (!Reflect.hasMetadata(SAGA_METADATA, target)) {
      const properties = Object.getOwnPropertyNames(target.prototype);
      const eventHandlerPropertyNames: string[] = [];

      properties.forEach((propertyName) => {
        const sagaEventHandlerMeta = Reflect.getMetadata(SAGA_EVENT_HANDLER, target.prototype, propertyName);

        if (sagaEventHandlerMeta) {
          eventHandlerPropertyNames.push(propertyName);
        }
      });

      const metadata: SagaMetadata = {
        id: uuid.v4(),
        sagaId: target.name,
        eventHandlers: eventHandlerPropertyNames.map((x) => ({
          propertyName: x,
        })),
      };

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);
    }
  };
}

export function isSaga(target: any): target is Function {
  return target instanceof Function && Reflect.hasMetadata(SAGA_METADATA, target);
}
