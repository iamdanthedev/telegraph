import * as express from 'express';
import { LogToConsoleCommand } from './app/command/log-to-console.command';
import { bootstrapTelegraph } from './app/bootstrap-telegraph';
import { constants } from './app/constants';

const telegraphContext = bootstrapTelegraph();
const app = express();
app.use(express.json());

app.get('/api/log-to-console', async (req, res, next) => {
  const message = req.query.message as string;
  const shouldFail = req.query.shouldFail === 'true';

  const command: LogToConsoleCommand = {
    message,
    shouldFail,
  };

  const result = telegraphContext.commandBus.publish(
    constants.LogToConsoleCommand,
    command,
    {},
    {
      next: (message) => {
        console.log('command response');
        console.log(message.payload);
      },
      error: (err) => {
        console.log('command response error!');
        console.log(err);
      },
    }
  );

  res.json(result);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});
