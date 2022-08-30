import { Logger } from './logger';

export interface ILoggerFactory {
  create(context: string): Logger;
}
