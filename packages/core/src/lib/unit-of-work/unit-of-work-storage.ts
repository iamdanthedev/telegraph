import { AsyncLocalStorage } from 'node:async_hooks';
import { UnitOfWork } from './unit-of-work';

export const unitOfWorkStorage = new AsyncLocalStorage<UnitOfWork<any>>();
