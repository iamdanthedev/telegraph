import { Logger } from './logger';
import { ILoggerFactory } from './logger-factory';

export class ConsoleLoggerFactory implements ILoggerFactory {
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
    console.log(this.context, message, ...args);
  }

  log(message: string, ...args: any[]): void {
    console.log(this.context, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.context, message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(this.context, message, ...args);
  }
}
