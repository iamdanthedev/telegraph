import { CommandMessage } from "./command-message";
import { MessageHandler } from "../messaging/message-handler";

export interface CommandHandler<T extends CommandMessage<any>, R = any> extends MessageHandler<T, R> {}
