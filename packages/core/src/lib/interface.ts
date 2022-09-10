// import { Logger } from './logging/logger';
//
// export interface BaseMessage {
//   messageId: string;
//   type: string;
//   metadata: MessageMetadata;
// }
//
//
// export interface CommandMessage<T = unknown> extends BaseMessage {
//   type: 'command';
//   commandName: string;
//   payload: T;
//   metadata: MessageMetadata;
// }
//
// export interface CommandMessageInput {
//   commandName: string;
//   payload?: object;
//   metadata?: MessageMetadata;
// }
//
// export interface EventMessage<T = unknown> extends BaseMessage {
//   type: 'event';
//   eventName: string;
//   payload: T;
//   metadata: MessageMetadata;
// }
//
// export interface CommandResultMessage<T = unknown> extends BaseMessage {
//   type: 'commandResult';
//   commandName: string;
//   commandMessageId: string;
//   payload: T;
//   exception: Error | null;
//   isExceptional: boolean;
// }
//
// export type CommandHandler<T = unknown> = (
//   message: CommandMessage<T>,
//   context: ExecutionContext
// ) => Promise<any>;
//
// export interface ExecutionContext {
//   logger: Logger;
//   commandPublisher: CommandPublisher;
// }
//
// export type EventHandler<T = unknown> = (
//   message: EventMessage<T>,
//   context: ExecutionContext
// ) => Promise<any>;
//
// export function isCommandResultMessage<T = unknown>(
//   message: BaseMessage
// ): message is CommandResultMessage {
//   return message.type === 'commandResult';
// }
//
// export interface CommandPublisher {
//   publish(command: CommandMessage): void;
// }
//
// export interface EventPublisher {
//   publish(command: EventMessage): void;
// }
