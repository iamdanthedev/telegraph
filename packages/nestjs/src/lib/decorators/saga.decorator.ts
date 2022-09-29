import 'reflect-metadata';
import * as uuid from 'uuid';
import { SAGA_EVENT_HANDLER, SAGA_METADATA } from './constants';

export interface SagaMetadata {
  id: string;
  sagaId: string;
}

export function Saga() {
  return function (target: Function) {
    if (!Reflect.hasMetadata(SAGA_METADATA, target)) {
      const metadata: SagaMetadata = {
        id: uuid.v4(),
        sagaId: target.name,
      };

      Reflect.defineMetadata(SAGA_METADATA, metadata, target);

      const properties = Object.getOwnPropertyNames(target.prototype);

      properties.forEach((propertyName) => {
        const sagaEventHandlerMeta = Reflect.getMetadata(SAGA_EVENT_HANDLER, target.prototype, propertyName);

        if (sagaEventHandlerMeta) {
          console.log(sagaEventHandlerMeta);
        }
      });
    }
  };
}

export function isSaga(target: any): target is Function {
  return target instanceof Function && Reflect.hasMetadata(SAGA_METADATA, target);
}
