import 'reflect-metadata';
import * as uuid from 'uuid';
import type { Class } from 'type-fest';
import { EVENT_METADATA, EVENT_HANDLER_METADATA, telegraphEventHandler } from './constants';

export function EventHandler(event: Class<any>): ClassDecorator {
  return function (target: Function) {
    if (!Reflect.hasMetadata(EVENT_METADATA, event)) {
      Reflect.defineMetadata(EVENT_METADATA, { id: uuid.v4(), name: event.name }, event);
    }

    const eventHandlerId = uuid.v4();

    Object.defineProperty(target, telegraphEventHandler, {
      value: {
        id: eventHandlerId,
      },
    });

    Reflect.defineMetadata(EVENT_HANDLER_METADATA, event, target);
  };
}
