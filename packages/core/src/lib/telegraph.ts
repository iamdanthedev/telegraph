import { createTelegraphContext } from './context/create-telegraph-context';
import { contextStorage } from './context/context-storage';
import { TelegraphContext } from './context/telegraph-context';

export class Telegraph {
  globalContext: TelegraphContext;

  constructor() {
    this.globalContext = createTelegraphContext({
      isGlobal: true,
    });
  }

  get context(): TelegraphContext {
    const scopedContext = contextStorage.getStore();

    if (scopedContext) {
      return scopedContext;
    }

    return this.globalContext;
  }
}
