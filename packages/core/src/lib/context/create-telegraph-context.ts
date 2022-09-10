// import { TelegraphContext } from './telegraph-context';
// import { LoggerFactory } from '../logging/logger-factory';
// import { LocalMessageBus } from '../local-message-bus/local-message-bus';
// import { CommandBus } from '../command-bus/command-bus';
// import { EventBus } from '../event-bus/event-bus';
// import { UnitOfWorkFactory } from "../unit-of-work/unit-of-work-factory";
// import { BasicUnitOfWork } from "../unit-of-work/basic-unit-of-work";
//
// export interface TelegraphContextOptions {
//   isGlobal: boolean;
//   loggerFactory: LoggerFactory;
// }
//
// export function createTelegraphContext(options: TelegraphContextOptions) {
//   const messageBus = new LocalMessageBus(options.loggerFactory);
//   const commandBus = new CommandBus(messageBus, options.loggerFactory);
//   const eventBus = new EventBus(messageBus, options.loggerFactory);
//
//   const context: TelegraphContext = {
//     isGlobal: options.isGlobal,
//     loggerFactory: options.loggerFactory,
//     messageBus,
//     commandBus,
//     eventBus,
//     unitOfWorkFactory: {
//       create: () => new BasicUnitOfWork()
//     }
//   };
//
//   return context;
// }
