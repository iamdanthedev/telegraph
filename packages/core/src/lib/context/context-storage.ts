import { AsyncLocalStorage } from 'node:async_hooks';
import { ITelegraphContext } from './telegraph-context';

export const contextStorage = new AsyncLocalStorage<ITelegraphContext>();
