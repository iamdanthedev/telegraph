export class AssociationValue<T extends string | number> {
  constructor(private readonly key: string, private readonly value: T) {}

  getKey(): string {
    return this.key;
  }

  getValue(): T {
    return this.value;
  }
}
