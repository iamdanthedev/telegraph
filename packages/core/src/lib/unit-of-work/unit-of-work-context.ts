import { CommandGateway } from "../command-handling/command-gateway";
import { EventGateway } from "../event-handling/event-gateway";

export interface UnitOfWorkContext {
  commandGateway: CommandGateway;
  eventGateway: EventGateway;
}
