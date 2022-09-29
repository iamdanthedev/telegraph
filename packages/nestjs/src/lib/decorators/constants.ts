export const COMMAND_METADATA = 'COMMAND_METADATA';
export const COMMAND_HANDLER_METADATA = 'COMMAND_HANDLER_METADATA';
export const EVENT_METADATA = 'EVENT_METADATA';
export const EVENT_HANDLER_METADATA = 'EVENT_HANDLER_METADATA';
export const SAGA_METADATA = 'SAGA_METADATA';
export const SAGA_START_METADATA = 'SAGA_START_METADATA';
export const SAGA_END_METADATA = 'SAGA_END_METADATA';

export const telegraphCommandHandlerDescriptor = Symbol('TelegraphCommandHandler');
export const telegraphEventHandlerDescriptor = Symbol('TelegraphEventHandler');
