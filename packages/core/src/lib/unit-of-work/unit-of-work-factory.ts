import { UnitOfWork } from "./unit-of-work";
import { BaseMessage, EventHandler, CommandHandler } from "../interface";

export interface UnitOfWorkFactory {
  create(message: BaseMessage, handler: EventHandler | CommandHandler): UnitOfWork;
}
