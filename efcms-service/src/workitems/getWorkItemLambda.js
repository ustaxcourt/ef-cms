const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * getWorkItem
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() =>
    applicationContext.getUseCases().getWorkItem({
      userId: getAuthHeader(event),
      workItemId: event.pathParameters.workItemId,
      applicationContext,
    }),
  );
