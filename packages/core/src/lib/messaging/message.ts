import { MessageType } from '../common/message-type';

export type MessageMetadata = Record<string, string | number>;

export interface Message<T extends Record<string, any> = Record<string, any>> {
  messageId: string;
  metadata: MessageMetadata;
  payload: T;
  type: MessageType;
}
