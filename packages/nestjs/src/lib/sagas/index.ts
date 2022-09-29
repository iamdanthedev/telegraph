export interface SagaOptions {}

export function Saga(options?: SagaOptions) {
  return function (target: Function) {};
}

export function SagaStart() {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {};
}

export function SagaEnd() {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {};
}

export interface SagaEventHandlerOptions {
  associationProperty: string;
}

export function SagaEventHandler(eventName: string, options: SagaEventHandlerOptions) {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {};
}
