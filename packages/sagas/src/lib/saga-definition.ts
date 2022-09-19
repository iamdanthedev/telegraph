export type SagaState = Record<string, any>;

export interface SagaEventHandlerContext {
  sagaId: string;
  sagaInstanceId: string;
}

export interface SagaEventHandlerDescriptor {
  sagaStart: boolean;
  sagaEnd: boolean;
  callback(event: object, context: SagaEventHandlerContext): Promise<void>;
}

export interface SagaDefinition {
  sagaId: string;
  initialState: SagaState;
  handlers: Array<SagaEventHandlerDescriptor>;

}
