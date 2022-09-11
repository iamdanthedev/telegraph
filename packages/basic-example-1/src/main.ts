import * as express from 'express';
import { CommandMessageFactory, CommandResultListener } from '@telegraph/core';
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

  const logToConsoleCommandResultInterceptor = new CommandResultListener({
    command: logToConsoleCommandMessage,
    timeout: 1000,
    onIntercept: (commandResult) => {
      console.log('INTERCEPTED', commandResult);
      res.json(commandResult);
    },
    onTimeout: () => {
      res.status(500).json({ error: 'Command timed out' });
      console.log('TIMEOUT');
    },
    onError: (error) => {
      console.log('ERROR', error);
      res.status(500).json({ error: error?.message });
    },
  });

  telegraphContext.messageBus.registerListener(logToConsoleCommandResultInterceptor);

  await telegraphContext.commandBus.dispatch(logToConsoleCommandMessage);
});

app.get('/api/gw/log-to-console', async (req, res, next) => {
  const message = req.query.message as string;
  const shouldFail = req.query.shouldFail === 'true';

  try {
    const result = await telegraphContext.commandGateway.dispatchAndWaitForResult(
      'LogToConsoleCommand',
      { message, shouldFail },
      {},
      { timeout: 1000 }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});
