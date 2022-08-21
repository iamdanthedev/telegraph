import { createTelegraphContext } from '@telegraph/core';
import { LogToConsoleCommand } from './app/command/log-to-console.command';
import { LogToConsoleHandler } from './app/handler/log-to-console.handler';

async function main() {
  const context = createTelegraphContext();

  const logToConsoleHandler = new LogToConsoleHandler();

  context.commandBus.registerHandler<LogToConsoleCommand>(
    LogToConsoleCommand.name,
    (message) => logToConsoleHandler.handle(message.payload)
  );

  const logToConsoleCommand1 = new LogToConsoleCommand('Hello World!', false);
  const logToConsoleCommand2 = new LogToConsoleCommand('Hello again!', false);
  const logToConsoleCommand3 = new LogToConsoleCommand('This fails', true);

  context.commandBus.publish(
    logToConsoleCommand1.constructor.name,
    logToConsoleCommand1,
    {}
  );

  context.commandBus.publish(
    logToConsoleCommand2.constructor.name,
    logToConsoleCommand2,
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

  context.commandBus.publish(
    logToConsoleCommand3.constructor.name,
    logToConsoleCommand3,
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

  for (let i = 0; i < 10; i++) {
    console.log('waiting...');
    await timeout(500);
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => {
    console.log('finished');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });