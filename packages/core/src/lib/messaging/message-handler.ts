import { Message } from "./message";

export interface MessageHandler<T extends Message<any>, R = any> {
  handle(message: T): Promise<R> | R;
  canHandle(message: T): boolean;
}
