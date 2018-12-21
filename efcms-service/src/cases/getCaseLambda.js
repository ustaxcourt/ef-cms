const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for fetching a single case
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().getCase({
      userId: getAuthHeader(event),
      caseId: event.pathParameters.caseId,
      applicationContext,
    });
  });
