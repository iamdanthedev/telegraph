import { Message } from '../messaging/message';
import { AsyncFunction } from '../utils';

export enum UnitOfWorkPhase {
  NotStarted = 'NotStarted',
  Started = 'Started',
  Committing = 'Committing',
  RollingBack = 'RollingBack',
  Completed = 'Completed',
}

export type UnitOfWorkCallback<T> = () => Promise<T>;

export interface UnitOfWork<T extends Message> {
  id: string;
  message: T;
  phase: UnitOfWorkPhase;

  start(): void;
  execute<R>(callback: UnitOfWorkCallback<R>): Promise<R>;

  onCommit(handler: AsyncFunction): void;
  onRollback(handler: AsyncFunction): void;
  onCleanup(handler: AsyncFunction): void;
}
