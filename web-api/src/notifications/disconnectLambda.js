const createApplicationContext = require('../applicationContext');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 */
exports.handler = event =>
  handle(event, async () => {
    console.log('disconnect lambda');
    const applicationContext = createApplicationContext({});
    try {
      const results = await applicationContext
        .getUseCases()
        .onDisconnectInteractor({
          applicationContext,
          connectionId: event.requestContext.connectionId,
        });
      applicationContext.logger.info(
        'Connection',
        event.requestContext.connectionId,
      );
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
