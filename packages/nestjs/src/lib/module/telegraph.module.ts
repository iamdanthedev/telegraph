import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { EventPublisher } from '../providers/event-publisher';
import { CommandPublisher } from '../providers/command-publisher';
import { ExplorerService } from '../service/explorer.service';

@Module({
  providers: [DiscoveryService, ExplorerService, EventPublisher, CommandPublisher],
  exports: [EventPublisher, CommandPublisher],
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
