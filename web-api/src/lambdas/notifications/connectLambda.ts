import { genericHandler } from '../../genericHandler';

/**
 * save the information about a new websocket connection
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const connectLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext, clientConnectionId }) => {
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
