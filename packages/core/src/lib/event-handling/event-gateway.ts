import { MessageMetadata } from '../messaging/message';
import { EventBus } from './event-bus';
import { EventMessageFactory } from './event-message-factory';

export class EventGateway {
  constructor(private readonly eventBus: EventBus) {}

  async dispatch<T>(eventName: string, payload: T, metadata?: MessageMetadata) {
    const event = EventMessageFactory.create(eventName, payload, metadata);
    await this.eventBus.dispatch(event);
    return event;
  }
}
