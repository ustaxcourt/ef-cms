const { genericHandler } = require('../genericHandler');

/**
 * remove the information about an existing websocket connection
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.disconnectLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
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

      return results;
    },
    { user: {} },
  );
