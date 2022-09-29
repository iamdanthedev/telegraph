import 'reflect-metadata';
import * as uuid from 'uuid';
import type { Class } from 'type-fest';
import { EVENT_METADATA, EVENT_HANDLER_METADATA } from './constants';

export interface EventMetadata {
  id: string;
  eventName: string;
}

export interface EventHandlerMetadata {
  id: string;
  eventName: string;
}

export function EventHandler(event: Class<any>): ClassDecorator {
  return function (target: Function) {
    if (!Reflect.hasMetadata(EVENT_METADATA, event)) {
      const eventMetadata: EventMetadata = {
        id: uuid.v4(),
        eventName: event.name,
      };

      Reflect.defineMetadata(EVENT_METADATA, eventMetadata, event);
    }

    const handlerMetadata: EventHandlerMetadata = {
      id: uuid.v4(),
      eventName: event.name,
    };

    Reflect.defineMetadata(EVENT_HANDLER_METADATA, handlerMetadata, target);
  };
}

export function isTelegraphEventHandler(target: any): target is Function {
  return target instanceof Function && Reflect.hasMetadata(EVENT_HANDLER_METADATA, target);
}
