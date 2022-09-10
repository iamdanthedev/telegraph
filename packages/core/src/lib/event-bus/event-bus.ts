// import { filter, Observable, map, mergeMap, from, Subscription } from 'rxjs';
// import { LocalMessageBus } from '../local-message-bus/local-message-bus';
// import { EventMessage, EventHandler, MessageMetadata } from '../interface';
// import { createId } from '../utils';
// import { Logger } from '../logging/logger';
// import { LoggerFactory } from '../logging/logger-factory';
//
// export class EventBus {
//   private logger: Logger;
//   private stream!: Observable<any>;
//   private handlingSubscription!: Subscription;
//   private handlers: Record<string, Array<EventHandler<any>>> = {};
//
//   constructor(
//     private readonly messageBus: LocalMessageBus,
//     loggerFactory: LoggerFactory
//   ) {
//     this.logger = loggerFactory.create('EventBus');
//     this.subscribe();
//   }
//
//   registerHandler<T>(eventName: string, handler: EventHandler<T>) {
//     this.handlers[eventName] = this.handlers[eventName] || [];
//     this.handlers[eventName].push(handler);
//
//     this.logger.log('registered handler for event', eventName);
//   }
//
//   publish<T = unknown>(eventName: string, payload: T): void;
//   publish<T = unknown>(
//     eventName: string,
//     payload: T,
//     metadata: MessageMetadata
//   ): void;
//   publish<T = unknown>(
//     eventName: string,
//     payload: T,
//     metadata?: MessageMetadata
//   ): void {
//     metadata = metadata || {};
//
//     const message: EventMessage<T> = {
//       messageId: createId(),
//       type: 'event',
//       eventName: eventName,
//       payload,
//       metadata,
//     };
//
//     this.messageBus.publish(message);
//     this.logger.log('published event', eventName);
//   }
//
//   private subscribe() {
//     this.stream = this.messageBus
//       .asObservable()
//       .pipe(filter((message) => message.type === 'event'));
//
//     this.handlingSubscription = this.stream
//       .pipe(
//         mergeMap((message) =>
//           from(this.getHandlers(message)).pipe(
//             map((handler) => [handler, message])
//           )
//         )
//       )
//       .subscribe({
//         next: ([handler, message]) => {
//           return handler(message);
//         },
//         error: (err) => {
//           this.logger.error(err);
//         },
//       });
//   }
//
//   private getHandlers(message: EventMessage) {
//     return this.handlers[message.eventName] || [];
//   }
// }
