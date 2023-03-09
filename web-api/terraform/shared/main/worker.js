const createApplicationContext = require('../../src/applicationContext');
const applicationContext = createApplicationContext({});
const { scanMessages } = require('./worker.helper');

const main = () => {
  setTimeout(async function () {
    const messages = await applicationContext
      .getPersistenceGateway()
      .getMessages({
        appContext: applicationContext,
      });
    await scanMessages({ appContext: applicationContext, messages });
  }, 10 * 1000);
};

main();
