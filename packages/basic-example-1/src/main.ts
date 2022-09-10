import * as express from 'express';
import { CommandMessageFactory, CommandResultInterceptor } from '@telegraph/core';
import { LogToConsoleCommand } from './app/command/log-to-console.command';
import { bootstrapTelegraph } from './app/bootstrap-telegraph';

const telegraphContext = bootstrapTelegraph();
const app = express();
app.use(express.json());

app.get('/api/log-to-console', async (req, res, next) => {
  const message = req.query.message as string;
  const shouldFail = req.query.shouldFail === 'true';

  const logToConsoleCommandMessage = CommandMessageFactory.create<LogToConsoleCommand>(
    'LogToConsoleCommand',
    { message, shouldFail },
    {}
  );

  const logToConsoleCommandResultInterceptor = new CommandResultInterceptor({
    command: logToConsoleCommandMessage,
    timeout: 1000,
    onIntercept: (commandResult) => {
      console.log('INTERCEPTED', commandResult);
    },
    onTimeout: () => {
      console.log('TIMEOUT');
    },
    onError: (error) => {
      console.log('ERROR', error);
    },
  });

  telegraphContext.messageBus.registerListener(logToConsoleCommandResultInterceptor);

  await telegraphContext.commandBus.dispatch(logToConsoleCommandMessage);

  // const result = telegraphContext.commandBus.publish(
  //   constants.LogToConsoleCommand,
  //   command,
  //   {},
  //   {
  //     next: (message) => {
  //       console.log('command response');
  //       console.log(message.payload);
  //     },
  //     error: (err) => {
  //       console.log('command response error!');
  //       console.log(err);
  //     },
  //   }
  // );

  res.json(logToConsoleCommandMessage);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});
