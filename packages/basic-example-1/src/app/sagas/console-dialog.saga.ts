import { SagaDefinition } from '@telegraph/sagas';
import { LogToConsoleCommand } from '../command/log-to-console.command';

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
