const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * getCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() =>
    applicationContext.getUseCases().getCase({
      userId: getAuthHeader(event),
      caseId: event.pathParameters.caseId,
      applicationContext,
    }),
  );
