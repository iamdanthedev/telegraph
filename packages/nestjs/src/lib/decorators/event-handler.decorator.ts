import 'reflect-metadata';
import * as uuid from 'uuid';
import type { Class } from 'type-fest';
import { EVENT_METADATA, EVENT_HANDLER_METADATA, telegraphEventHandlerDescriptor } from './constants';

export interface EventHandlerDescriptor {
  id: string;
  eventName: string;
}

export function EventHandler(event: Class<any>): ClassDecorator {
  return function (target: Function) {
    if (!Reflect.hasMetadata(EVENT_METADATA, event)) {
      Reflect.defineMetadata(EVENT_METADATA, { id: uuid.v4(), name: event.name }, event);
    }

    const descriptor: EventHandlerDescriptor = {
      id: uuid.v4(),
      eventName: event.name,
    };

    Object.defineProperty(target, telegraphEventHandlerDescriptor, {
      value: descriptor,
    });

    Reflect.defineMetadata(EVENT_HANDLER_METADATA, event, target);
  };
}

export function isTelegraphEventHandler(target: any): target is Function {
  return target instanceof Function && Reflect.hasMetadata(EVENT_HANDLER_METADATA, target);
}

export function getEventHandlerDescriptor(target: Function) {
  return (target as any)[telegraphEventHandlerDescriptor] as EventHandlerDescriptor;
}
