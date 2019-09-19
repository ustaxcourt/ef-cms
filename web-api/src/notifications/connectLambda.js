const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 */
exports.handler = event => {
  console.log('wtf');
  console.log('wtf');
  console.log('wtf');
  console.log('wtf');
  return handle(event, async () => {
    console.log('we are here!!');
    console.log('event', event);
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .onConnectInteractor({
          applicationContext,
          connectionId: event.requestContext.connectionId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
};
