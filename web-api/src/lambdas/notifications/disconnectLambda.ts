import { genericHandler } from '../../genericHandler';

/**
 * remove the information about an existing websocket connection
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const disconnectLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const results = await applicationContext
        .getUseCases()
        .onDisconnectInteractor(applicationContext, {
          connectionId: event.requestContext.connectionId,
        });

      applicationContext.logger.debug('Websocket disconnected', {
        requestId: {
          connection: event.requestContext.connectionId,
        },
      });

      return results;
    },
    { bypassMaintenanceCheck: true, user: {} },
  );
