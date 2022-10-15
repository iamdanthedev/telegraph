import { Message, UnitOfWork, UnitOfWorkFactory as IUnitOfWork } from '@telegraph/core';

export abstract class UnitOfWorkFactory implements IUnitOfWork {
  abstract create<T extends Message>(message: T): UnitOfWork<T>;
}
