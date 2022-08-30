import { filter, Subject } from 'rxjs';
import { TelegraphContext, Logger, ILoggerFactory } from '@telegraph/core';
import { SagaDefinition, SagaInstanceEvent } from '../interface';
import { isSagaEventMessage, SagaEventMessage } from "../messaging/saga-event-message";
import { SagaCommandPublisher } from "../messaging/saga-command-publisher";

export class SagaInstance<Command, Phase, State> {
  private logger: Logger;

  getSubject() {
    return this.subject;
  }

  constructor(
    private readonly definition: SagaDefinition<Command, Phase, State>,
    private readonly publisher: SagaCommandPublisher,
    private readonly subject: Subject<SagaInstanceEvent<Phase>>,
    private readonly state: object,
    private readonly loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.create(`SagaController [${definition.sagaId}]`);
  }

  start(command: Command) {
    const step = this.definition.steps[0];



  }

  handleEvent(eventMessage: SagaEventMessage) {

  }

  asObservable() {
    return this.subject.asObservable();
  }
}
