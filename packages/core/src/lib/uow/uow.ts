import { TelegraphContext } from "../context/telegraph-context";
import { contextStorage } from "../context/context-storage";

export enum UnitOfWorkPhase {
  NotStarted = "NotStarted",
  Started = "Started",
  PrepareCommit = "PrepareCommit",
  Commit = "Commit",
  Rollback = "Rollback",
  Closed = "Closed"
}

export class UnitOfWork {
  phase: UnitOfWorkPhase;

  constructor(private readonly staticContext: TelegraphContext) {
    this.phase = UnitOfWorkPhase.NotStarted;
  }

  commit() {

  }

  rollback() {

  }


}
