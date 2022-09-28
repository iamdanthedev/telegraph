import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EventMessage, MessageType, TelegraphContext } from '@telegraph/core';
import { EVENT_METADATA } from '../decorators/constants';

@Injectable()
export class EventBus {
  async dispatch<T extends {}>(event: T): Promise<EventMessage<T>> {
    const metadata = Reflect.getMetadata(EVENT_METADATA, event);

    if (!metadata) {
      throw new Error(`Event ${event.constructor.name} is not registered`);
    }

    const eventMessage: EventMessage<T> = {
      eventName: metadata.name,
      type: MessageType.Event,
      messageId: uuid.v4(),
      metadata: {},
      payload: event,
    };

    await TelegraphContext.eventBus.dispatch(eventMessage);

    return eventMessage;
  }
}
