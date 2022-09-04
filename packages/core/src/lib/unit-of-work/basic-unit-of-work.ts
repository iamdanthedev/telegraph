import { BufferedCommandPublisher } from './buffered-command-publisher';
import { UnitOfWork, UnitOfWorkCallback, UnitOfWorkPhase } from './unit-of-work';
import { unitOfWorkStorage } from './unit-of-work-storage';
import { TelegraphContext } from '../context/telegraph-context';
import { Logger } from '../logging/logger';
import { CommandMessage, CommandHandler, EventMessage, EventHandler, ExecutionContext } from '../interface';
import { createId } from '../utils';

export class BasicUnitOfWork<T> implements UnitOfWork {
  id: string;
  logger: Logger;
  phase: UnitOfWorkPhase;
  message!: CommandMessage | EventMessage;
  handler!: CommandHandler<T> | EventHandler<T>;

  static createForCommand<T>(command: CommandMessage, handler: CommandHandler<T>, context: TelegraphContext) {
    const unitOfWork = new BasicUnitOfWork<T>(context);
    unitOfWork.message = command;
    unitOfWork.handler = handler;
    return unitOfWork;
  }

  static createForEvent<T>(event: EventMessage, handler: EventHandler<T>, context: TelegraphContext) {
    const unitOfWork = new BasicUnitOfWork<T>(context);
    unitOfWork.message = event;
    unitOfWork.handler = handler;
    return unitOfWork;
  }

  constructor(private readonly context: TelegraphContext) {
    this.id = createId();
    this.logger = context.loggerFactory.create(`BasicUnitOfWork [${this.id}]`);
    this.phase = UnitOfWorkPhase.NotStarted;
  }

  run<T>(callback: UnitOfWorkCallback<T>): T {
    this.phase = UnitOfWorkPhase.Started;
    return unitOfWorkStorage.run(this, callback);
  }

  success() {
    if (this.phase !== UnitOfWorkPhase.Started) {
      throw new Error('Cannot complete unit of work.');
    }

    this.phase = UnitOfWorkPhase.Completed;
  }

  failed() {
    if (this.phase !== UnitOfWorkPhase.Started) {
      throw new Error('Cannot fail unit of work.');
    }

    this.phase = UnitOfWorkPhase.RollingBack;
  }

  async execute() {
    const commandPublisher = new BufferedCommandPublisher(this.context);
    const logger = this.context.loggerFactory.create(`ExecutionContext [${this.id}]`);

    try {
      await unitOfWorkStorage.run(this, async () => {
        this.phase = UnitOfWorkPhase.Started;

        const executionContext: ExecutionContext = {
          logger,
          commandPublisher,
        };

        await this.handler(this.message as any, executionContext);
        await commandPublisher.execute();
      });
    } catch (e) {
      this.phase = UnitOfWorkPhase.RollingBack;
      await commandPublisher.rollback();
    } finally {
      this.phase = UnitOfWorkPhase.Completed;
    }
  }
}
