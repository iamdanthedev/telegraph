import { LoggerFactory } from '../logging/logger-factory';
import { CommandPublisher, EventPublisher } from "../interface";

export enum UnitOfWorkPhase {
  NotStarted = 'NotStarted',
  Started = 'Started',
  RollingBack = 'RollingBack',
  Completed = 'Completed',
}

export interface UnitOfWork {
  phase: UnitOfWorkPhase;
  run<T>(callback: UnitOfWorkCallback<T>): T;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface UnitOfWorkExecutionContext {
  commandPublisher: CommandPublisher;
  eventPublisher: EventPublisher;
  loggerFactory: LoggerFactory;
}

export type UnitOfWorkCallback<T> = (context: UnitOfWorkExecutionContext) => T;
