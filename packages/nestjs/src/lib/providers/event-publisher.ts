import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EventMessage, MessageType, TelegraphContext } from '@telegraph/core';
import { EVENT_METADATA } from '../decorators/constants';
import { EventMetadata } from '../decorators/event-handler.decorator';

@Injectable()
export class EventPublisher {
  async publish<T extends {}>(event: T): Promise<EventMessage<T>> {
    const metadata: EventMetadata = Reflect.getMetadata(EVENT_METADATA, (event as any).constructor);

    if (!metadata) {
      throw new Error(`Event ${event.constructor.name} is not registered`);
    }

    const eventMessage: EventMessage<T> = {
      eventName: metadata.eventName,
      type: MessageType.Event,
      messageId: uuid.v4(),
      metadata: {},
      payload: event,
    };

    await TelegraphContext.eventBus.dispatch(eventMessage);

    return eventMessage;
  }
}
