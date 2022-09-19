import { Message } from './message';

export interface MessageHandlerDefinition<T extends Message<any> = Message<any>> {
  canHandleCallback(message: T): boolean;
  handleCallback(message: T): Promise<any> | any;
}
