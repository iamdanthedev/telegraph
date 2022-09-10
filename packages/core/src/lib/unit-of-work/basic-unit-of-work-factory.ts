import { UnitOfWorkFactory } from './unit-of-work-factory';
import { BasicUnitOfWork } from './basic-unit-of-work';
import { UnitOfWork } from './unit-of-work';
import { LoggerFactory } from '../logging/logger-factory';
import { Message } from '../messaging/message';

export class BasicUnitOfWorkFactory implements UnitOfWorkFactory {
  constructor(private readonly loggerFactory: LoggerFactory) {}

  create<T extends Message>(message: T): UnitOfWork<T> {
    return new BasicUnitOfWork<T>(this.loggerFactory, message);
  }
}
