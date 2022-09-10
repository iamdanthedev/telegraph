import { UnitOfWork, UnitOfWorkPhase } from './unit-of-work';
import { unitOfWorkStorage } from './unit-of-work-storage';
import { Logger } from '../logging/logger';
import { createId } from '../utils';
import { Message } from '../messaging/message';
import { LoggerFactory } from '../logging/logger-factory';
import { MessageHandler } from '../messaging/message-handler';

export class BasicUnitOfWork<T extends Message> implements UnitOfWork<T> {
  id: string;
  logger: Logger;
  phase: UnitOfWorkPhase;

  constructor(private readonly loggerFactory: LoggerFactory, public readonly message: T) {
    this.id = createId();
    this.logger = loggerFactory.create(`BasicUnitOfWork [${this.id}]`);
    this.phase = UnitOfWorkPhase.NotStarted;
  }

  async execute<R>(handler: MessageHandler<T, R>): Promise<R | null> {
    this.phase = UnitOfWorkPhase.Started;
    return this.doExecute(handler);
  }

  private async doExecute<R>(handler: MessageHandler<T, R>): Promise<R | null> {
    return unitOfWorkStorage.run(this, async () => {
      this.phase = UnitOfWorkPhase.Started;
      try {
        return await handler.handle(this.message);
      } catch (err) {
        this.phase = UnitOfWorkPhase.RollingBack;
        // this.rollback();
        this.phase = UnitOfWorkPhase.Completed;
        return null;
      }
    });
  }

  // private success() {
  //   if (this.phase !== UnitOfWorkPhase.Started) {
  //     throw new Error('Cannot complete unit of work.');
  //   }
  //
  //   this.phase = UnitOfWorkPhase.Completed;
  // }
  //
  // private failed() {
  //   if (this.phase !== UnitOfWorkPhase.Started) {
  //     throw new Error('Cannot fail unit of work.');
  //   }
  //
  //   this.phase = UnitOfWorkPhase.RollingBack;
  // }
}
