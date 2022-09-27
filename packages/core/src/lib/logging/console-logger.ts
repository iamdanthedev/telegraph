import { Logger } from './logger';
import { LoggerFactory } from './logger-factory';

export class ConsoleLoggerFactory implements LoggerFactory {
  constructor(private readonly logLevel: 0 | 1 | 2 | 3 | 10 = 1) {}

  create(context: string): Logger {
    const logger = new ConsoleLogger(context, this.logLevel);
    logger.setContext(context);
    return logger;
  }
}

export class ConsoleLogger implements Logger {
  constructor(private context: string, private logLevel: 0 | 1 | 2 | 3 | 10 = 1) {}

  setContext(context: string) {
    this.context = context;
  }

  debug(message: string, ...args: any[]): void {
    if (this.logLevel > 0) {
      return;
    }

    console.log('[debug]', this.context, message, ...args);
  }

  log(message: string, ...args: any[]): void {
    if (this.logLevel > 1) {
      return;
    }

    console.log('[log]', this.context, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    if (this.logLevel > 2) {
      return;
    }

    console.warn('[warn]', this.context, message, ...args);
  }

  error(message: string, ...args: any[]): void {
    if (this.logLevel > 3) {
      return;
    }

    console.error('[error]', this.context, message, ...args);
  }
}
