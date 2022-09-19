import { UnitOfWork, UnitOfWorkPhase, UnitOfWorkCallback } from './unit-of-work';
import { unitOfWorkStorage } from './unit-of-work-storage';
import { Logger } from '../logging/logger';
import { AsyncFunction, createId } from '../utils';
import { Message } from '../messaging/message';
import { LoggerFactory } from '../logging/logger-factory';

export class BasicUnitOfWork<T extends Message> implements UnitOfWork<T> {
  id: string;
  logger: Logger;
  phase: UnitOfWorkPhase;

  onCommitCallbacks: Array<AsyncFunction> = [];
  onCleanupCallbacks: Array<AsyncFunction> = [];
  onRollbackCallbacks: Array<AsyncFunction> = [];

  constructor(private readonly loggerFactory: LoggerFactory, public readonly message: T) {
    this.id = createId();
    this.logger = loggerFactory.create(`BasicUnitOfWork [${this.id}]`);
    this.phase = UnitOfWorkPhase.NotStarted;
  }

  async execute<R>(handler: UnitOfWorkCallback<R>): Promise<R> {
    return this.doExecute(handler);
  }

  private async doExecute<R>(handler: UnitOfWorkCallback<R>): Promise<R> {
    return unitOfWorkStorage.run(this, async () => {
      if (this.phase === UnitOfWorkPhase.NotStarted) {
        this.start();
      }

      try {
        this.logger.debug('Executing unit of work handler');
        const result = await handler();

        this.phase = UnitOfWorkPhase.Committing;
        await this.commit();

        this.phase = UnitOfWorkPhase.Completed;
        this.logger.log('Unit of work completed');

        return result;
      } catch (err) {
        this.logger.debug('Error occurred during unit of work handler execution');
        this.phase = UnitOfWorkPhase.RollingBack;
        await this.rollback();
        throw err;
      } finally {
        this.phase = UnitOfWorkPhase.Completed;
        await this.cleanup();
      }
    });
  }

  start() {
    this.phase = UnitOfWorkPhase.Started;
  }

  onCommit(handler: AsyncFunction) {
    this.onCommitCallbacks.push(handler);
  }

  onCleanup(handler: AsyncFunction) {
    this.onCleanupCallbacks.push(handler);
  }

  onRollback(handler: AsyncFunction) {
    this.onRollbackCallbacks.push(handler);
  }

  private async commit() {
    this.logger.debug('Committing unit of work');

    for (const callback of this.onCommitCallbacks) {
      this.logger.debug('Executing commit callback');
      await callback();
    }
  }

  private async cleanup() {
    this.logger.debug('Cleaning up unit of work');

    for (const callback of this.onCleanupCallbacks) {
      this.logger.debug('Executing cleanup callback');
      await callback();
    }
  }

  private async rollback() {
    this.logger.debug('Rolling back unit of work');

    for (const callback of this.onRollbackCallbacks) {
      this.logger.debug('Executing rollback callback');
      await callback();
    }
  }
}
