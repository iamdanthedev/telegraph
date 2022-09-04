import { Logger } from './logger';
import { LoggerFactory } from './logger-factory';

export class ConsoleLoggerFactory implements LoggerFactory {
  create(context: string): Logger {
    const logger = new ConsoleLogger();
    logger.setContext(context);
    return logger;
  }
}

export class ConsoleLogger implements Logger {
  private context: string = '';

  setContext(context: string) {
    this.context = context;
  }

  debug(message: string, ...args: any[]): void {
    console.log('[debug]', this.context, message, ...args);
  }

  log(message: string, ...args: any[]): void {
    console.log('[log]', this.context, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn('[warn]', this.context, message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error('[error]', this.context, message, ...args);
  }
}
