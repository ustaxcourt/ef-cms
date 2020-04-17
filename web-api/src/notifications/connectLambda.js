const { genericHandler } = require('../genericHandler');

/**
 * save the information about a new websocket connection
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.connectLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const endpoint = event.requestContext.domainName;

    return await applicationContext.getUseCases().onConnectInteractor({
      applicationContext,
      connectionId: event.requestContext.connectionId,
      endpoint,
    });
  });
