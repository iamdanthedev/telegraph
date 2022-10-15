import { DynamicModule, Global, Module, ModuleMetadata, OnModuleInit, Optional, Provider } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import {
  BasicUnitOfWorkFactory,
  ConsoleLoggerFactory,
  LocalMessageBus,
  LoggerFactory,
  SimpleCommandBus,
  SimpleEventBus,
  TelegraphContext,
} from '@telegraph/core';
import { EventPublisher } from '../providers/event-publisher';
import { CommandPublisher } from '../providers/command-publisher';
import { UnitOfWorkFactory } from '../providers/unit-of-work-factory';
import { ExplorerService } from '../service/explorer.service';
import { SagaManager } from '@telegraph/sagas';
import { MongoSagaStateRepository } from '@telegraph/sagas-mongodb';

export class TelegraphModuleOptions {
  loggerFactory?: LoggerFactory;
  sagasOptions?: {
    mongoUri: string;
  };
}

@Global()
@Module({
  providers: [DiscoveryService, ExplorerService, EventPublisher, CommandPublisher],
  exports: [EventPublisher, CommandPublisher],
})
export class TelegraphModule implements OnModuleInit {
  static register(options: TelegraphModuleOptions): DynamicModule {
    const loggerFactory = options.loggerFactory || new ConsoleLoggerFactory(0); // fixme: integrate with nestjs logger

    const unitOfWorkFactory = new BasicUnitOfWorkFactory(loggerFactory);
    const messageBus = new LocalMessageBus(loggerFactory, unitOfWorkFactory);
    const eventBus = new SimpleEventBus(messageBus, loggerFactory, unitOfWorkFactory);
    const commandBus = new SimpleCommandBus(messageBus, loggerFactory, unitOfWorkFactory);

    TelegraphContext.register({
      loggerFactory,
      messageBus,
      eventBus,
      commandBus,
      unitOfWorkFactory,
    });

    const eventPublisher = new EventPublisher();
    const commandPublisher = new CommandPublisher();

    const providers: Provider[] = [
      DiscoveryService,
      ExplorerService,
      { provide: TelegraphModuleOptions, useValue: options },
      { provide: EventPublisher, useValue: eventPublisher },
      { provide: CommandPublisher, useValue: commandPublisher },
      { provide: UnitOfWorkFactory, useValue: unitOfWorkFactory },
      { provide: TelegraphContext, useFactory: () => TelegraphContext.instance },
    ];

    const exports: ModuleMetadata['exports'] = [
      TelegraphModuleOptions,
      EventPublisher,
      CommandPublisher,
      UnitOfWorkFactory,
      TelegraphContext,
    ];

    if (options.sagasOptions) {
      const repository = new MongoSagaStateRepository({ uri: options.sagasOptions.mongoUri });
      const sagaManager = new SagaManager(loggerFactory, unitOfWorkFactory, repository);

      providers.push({ provide: SagaManager, useValue: sagaManager });
      exports.push(SagaManager);
    }

    return {
      module: TelegraphModule,
      providers,
      exports,
    };
  }

  constructor(
    private readonly explorerService: ExplorerService,
    @Optional() private readonly sagaManager: SagaManager
  ) {
    // fixme: this runs twice!
    console.log('TelegraphModule constructor');
  }

  async onModuleInit() {
    this.explorerService.registerCommandHandlers();
    this.explorerService.registerEventHandlers();

    if (this.sagaManager) {
      await this.sagaManager.initialize();
      this.explorerService.registerSagas();
    }
  }
}
