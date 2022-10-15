import 'reflect-metadata';
import * as uuid from 'uuid';
import { SAGA_START_METADATA } from './constants';

export interface SagaStartMetadata {
  id: string;
  sagaId: string;
  initialState: any;
}

export interface SagaStartOptions<T> {
  initialState: T;
}

export function SagaStart<T>(options: SagaStartOptions<T>) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    if (!Reflect.hasMetadata(SAGA_START_METADATA, target, key)) {
      const metadata: SagaStartMetadata = {
        id: uuid.v4(),
        sagaId: target.constructor.name,
        initialState: options.initialState,
      };

      Reflect.defineMetadata(SAGA_START_METADATA, metadata, target, key);
    }
  };
}
