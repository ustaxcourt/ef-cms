const { genericHandler } = require('../genericHandler');
const { getConnectionIdFromEvent } = require('../middleware/apiGatewayHelper');

/**
 * save the information about a new websocket connection
 *
 * @param {object} event the AWS event object
 */
exports.connectLambda = event => {
  const clientConnectionId = getConnectionIdFromEvent(event);

  genericHandler(
    event,
    async ({ applicationContext }) => {
      const endpoint = event.requestContext.domainName;

      await applicationContext
        .getUseCases()
        .onConnectInteractor(applicationContext, {
          clientConnectionId,
          connectionId: event.requestContext.connectionId,
          endpoint,
        });

      applicationContext.logger.debug('Websocket connected', {
        requestId: {
          connection: event.requestContext.connectionId,
        },
      });
    },
    { bypassMaintenanceCheck: true },
  );
};
