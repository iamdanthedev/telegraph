import 'reflect-metadata';
import * as uuid from 'uuid';
import { SAGA_END_METADATA } from './constants';

export interface SagaEndMetadata {
  id: string;
  sagaId: string;
}

export function SagaEnd() {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    if (!Reflect.hasMetadata(SAGA_END_METADATA, target, key)) {
      const metadata: SagaEndMetadata = {
        id: uuid.v4(),
        sagaId: target.constructor.name,
      };

      Reflect.defineMetadata(SAGA_END_METADATA, metadata, target, key);
    }
  };
}
