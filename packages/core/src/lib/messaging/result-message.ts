import { Message } from './message';

export interface ResultMessage<R = unknown> extends Message<R | null> {
  isExceptional: boolean;
  exception: Error | null;
}
