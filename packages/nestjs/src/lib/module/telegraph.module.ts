import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { EventBus } from '../providers/event-bus';
import { ExplorerService } from '../service/explorer.service';

@Module({
  providers: [EventBus, DiscoveryService, ExplorerService],
  exports: [EventBus],
})
export class TelegraphModule implements OnApplicationBootstrap {
  constructor(private readonly explorerService: ExplorerService) {
    console.log('TelegraphModule constructor');
  }

  onApplicationBootstrap() {
    this.explorerService.registerCommandHandlers();
    this.explorerService.registerEventHandlers();
  }
}
