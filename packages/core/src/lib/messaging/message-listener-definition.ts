import { Message } from "./message";
import { MessageType } from "../common/message-type";

export interface MessageListenerDefinition<T extends Message<any>> {
  handle(message: T): Promise<void>;
  canHandle(message: Message<any>): boolean;
  canHandleMessageType(): MessageType;
}
