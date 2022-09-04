import { Logger } from './logger';

export interface LoggerFactory {
  create(context: string): Logger;
}
