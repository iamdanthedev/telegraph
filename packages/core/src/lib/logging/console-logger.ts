import { Logger } from './logger';

export class ConsoleLogger implements Logger {
  debug(message: string, ...args: any[]): void {
    console.log(message, ...args);
  }

  log(message: string, ...args: any[]): void {
    console.log(message, ...args);
  }
  warn(message: string, ...args: any[]): void {
    console.warn(message, ...args);
  }
  error(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }
}
