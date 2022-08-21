import { TelegraphContext } from "../context/telegraph-context";
import { contextStorage } from "../context/context-storage";

export class UnitOfWork {
  constructor(private readonly staticContext: TelegraphContext) {
  }

  commit() {

  }

  rollback() {

  }


}
