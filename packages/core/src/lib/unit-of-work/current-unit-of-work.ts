import { UnitOfWork } from "./unit-of-work";
import { unitOfWorkStorage } from "./unit-of-work-storage";

export class CurrentUnitOfWork {
  static get(): UnitOfWork<any> | undefined {
    return unitOfWorkStorage.getStore();
  }
}
