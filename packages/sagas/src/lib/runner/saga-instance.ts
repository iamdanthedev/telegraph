import { filter, Subject } from 'rxjs';
import { TelegraphContext, Logger, LoggerFactory } from '@telegraph/core';
import {
  SagaDefinition,
  SagaInstanceEvent,
  SagaInstanceState,
} from '../interface';
import {
  isSagaEventMessage,
  SagaEventMessage,
} from '../messaging/saga-event-message';
import { SagaCommandPublisher } from '../messaging/saga-command-publisher';

export class SagaInstance<Command, Phase, State> {
  private logger: Logger;

  getSubject() {
    return this.subject;
  }

  constructor(
    private readonly definition: SagaDefinition<Command, Phase, State>,
    private readonly publisher: SagaCommandPublisher,
    private readonly subject: Subject<SagaInstanceEvent<Phase>>,
    private readonly state: SagaInstanceState<State>,
    private readonly loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.create(`SagaController [${definition.sagaId}]`);
  }

  start(command: Command) {
    const step = this.definition.steps[0];

    return this.asObservable();
  }

  handleEvent(eventMessage: SagaEventMessage) {}

  asObservable() {
    return this.subject.asObservable();
  }

  private step() {
    const step = this.definition.steps[0];

    step.invoke({
      state: this.state.payload,
      initialCommand: this.state.initialCommand,
      setState(value: State) {
        // fixme: publish state as event?
      }
    });
  }
}
