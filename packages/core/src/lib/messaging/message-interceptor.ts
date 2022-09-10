import { Message } from "./message";
import { MessageType } from "../common/message-type";

export interface MessageInterceptor<T extends Message<any>> {
  handle(message: T): Promise<void>;
  canHandle(message: Message<any>): boolean;
  handlesMessageType(): MessageType;
}
