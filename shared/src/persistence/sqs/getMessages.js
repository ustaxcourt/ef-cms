const createApplicationContext = require('../../../src/applicationContext');
const applicationContext = createApplicationContext({});

export const getMessages = async ({ appContext }) => {
  return await applicationContext
    .getMessagingClient()
    .getMessages({ applicationContext: appContext });
};
