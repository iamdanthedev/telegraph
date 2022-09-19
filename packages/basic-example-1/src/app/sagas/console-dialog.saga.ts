import { SagaDefinition, SagaEventMessage } from '@telegraph/sagas';
import { LogToConsoleCommand } from '../command/log-to-console.command';
import { LoggedToConsoleEvent } from "../events/logged-to-console.event";
import { randomUUID } from "crypto";

export enum ConsoleDialogSagaStatus {
  Initialized = 'Initialized',
  LoggedLocally = 'LoggedLocally',
  LoggedOnce = 'LoggedOnce',
  LoggedTwice = 'LoggedTwice',
  Completed = 'Completed',
}

export class StartConsoleDialogCommand {
  constructor(
    public readonly firstMessage: string,
    public readonly secondMessage: string,
    public readonly secondStepShouldFail: boolean
  ) {}
}

export interface ConsoleDialogSagaState {
  counter: number;
  compensatedCounter: number;
}

export const consoleDialogSagaDefinition: SagaDefinition<
  StartConsoleDialogCommand,
  ConsoleDialogSagaStatus,
  ConsoleDialogSagaState
> = {
  sagaId: 'ConsoleDialogSaga',
  initialState: {
    counter: 0,
    compensatedCounter: 0,
  },
  steps: [
    {
      transitionTo: ConsoleDialogSagaStatus.LoggedOnce,
      invoke: async ({ state, setState, initialCommand }) => {
        setState({
          ...state,
          counter: state.counter + 1,
          compensatedCounter: state.compensatedCounter + 1,
        });

        return {
          commandName: 'LogToConsoleCommand',
          payload: {
            message: initialCommand.firstMessage,
            shouldFail: false,
          },
        };
      },
      onReplyCallbacks: [
        {
          eventName: LoggedToConsoleEvent.name,
          invoke: (onReplyContext) => {
            const eventMessage: SagaEventMessage<any> = {
              sagaId: onReplyContext.sagaId,
              sagaInstanceId: onReplyContext.sagaInstanceId,
              messageId: randomUUID(),
              eventName: 'SagaTransitioned'

            }

            onReplyContext.saga.next()
          }

        },
        {

        }
      ],
      onReply: async (replyContext) => {


      },
      compensate: async ({ state, setState }) => {
        console.log('compensating');

        setState({
          ...state,
          counter: state.counter + 1,
          compensatedCounter: state.compensatedCounter - 1,
        });
      },
    },
    {
      transitionTo: ConsoleDialogSagaStatus.LoggedTwice,
      invoke: async ({ state, setState, initialCommand }) => {
        setState({
          ...state,
          counter: state.counter + 1,
          compensatedCounter: state.compensatedCounter + 1,
        });

        return {
          commandName: 'LogToConsoleCommand',
          payload: {
            message: initialCommand.secondMessage,
            shouldFail: initialCommand.secondStepShouldFail,
          },
        };
      },
      compensate: async ({ state, setState }) => {
        console.log('compensating 2');

        setState({
          ...state,
          counter: state.counter + 1,
          compensatedCounter: state.compensatedCounter - 1,
        });
      },
    },
  ],
};
