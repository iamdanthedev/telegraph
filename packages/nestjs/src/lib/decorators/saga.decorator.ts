import 'reflect-metadata';
import * as uuid from 'uuid';
import { SAGA_METADATA } from './constants';

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
    }
  };
}
