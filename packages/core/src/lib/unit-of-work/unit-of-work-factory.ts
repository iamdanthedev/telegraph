import { UnitOfWork } from './unit-of-work';
import { Message } from '../messaging/message';

export interface UnitOfWorkFactory {
  create<T extends Message<any>>(message: T): UnitOfWork<T>;
}
