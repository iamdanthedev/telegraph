
export interface SagaOrchestrator<T, U> {
  setState(state: U): Promise<void>;
  getDefinition(): SagaDefinition<T>;
}
