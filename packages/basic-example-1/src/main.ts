import * as express from 'express';
import * as uuid from 'uuid';
import {
  CommandMessageFactory,
  CommandResultMessage,
  MessageListenerDefinition,
  MessageType,
  TelegraphContext,
} from '@telegraph/core';
import { PlaceOrderCommand } from './app/command/place-order.command';
import { bootstrapTelegraph } from './app/bootstrap-telegraph';

bootstrapTelegraph();
const app = express();
app.use(express.json());

app.get('/api/code/place-order', async (req, res, next) => {
  const total = +req.query.message;
  const customerName = req.query.customerName?.toString() || '';

  const orderId = uuid.v4();

  const command = CommandMessageFactory.create<PlaceOrderCommand>(
    'PlaceOrderCommand',
    { orderId, total, customerName },
    {}
  );

  const resultListener: MessageListenerDefinition<CommandResultMessage<any>> = {
    canHandleMessageType: () => {
      return MessageType.CommandResult;
    },
    canHandle: (message: CommandResultMessage<CommandResultMessage<any>>) => {
      return message.commandMessageId === command.messageId;
    },
    handle: async (result) => {
      res.json(result);
    },
  };

  TelegraphContext.messageBus.registerListener(resultListener);

  await TelegraphContext.commandBus.dispatch(command);
});

// app.get('/api/gw/log-to-console', async (req, res, next) => {
//   const message = req.query.message as string;
//   const shouldFail = req.query.shouldFail === 'true';
//
//   try {
//     const result = await telegraphContext.commandGateway.dispatchAndWaitForResult(
//       'LogToConsoleCommand',
//       { message, shouldFail },
//       {},
//       { timeout: 1000 }
//     );
//
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ error: error?.message });
//   }
// });

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});
