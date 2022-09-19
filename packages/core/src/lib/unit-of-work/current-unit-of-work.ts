export class CurrentUnitOfWork {
  static get(): UnitOfWork | undefined {
    return unitOfWorkStorage.getStore();
  }
}
