import { Message } from '../messaging/message';
import { MessageHandler } from '../messaging/message-handler';

export enum UnitOfWorkPhase {
  NotStarted = 'NotStarted',
  Started = 'Started',
  Committing = 'Committing',
  RollingBack = 'RollingBack',
  Completed = 'Completed',
}

export interface UnitOfWork<T extends Message> {
  message: T;
  phase: UnitOfWorkPhase;
  execute<R>(handler: MessageHandler<T, R>): Promise<R | null>;
  // commit(): Promise<void>;
  // rollback(): Promise<void>;
}

// export interface UnitOfWorkExecutionContext {
//   commandPublisher: CommandPublisher;
//   eventPublisher: EventPublisher;
//   loggerFactory: LoggerFactory;
// }

export type UnitOfWorkCallback<T> = () => T;
