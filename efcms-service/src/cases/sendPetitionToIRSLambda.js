const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * updateCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.post = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().sendPetitionToIRS({
      caseId: event.pathParameters.caseId,
      userId,
      applicationContext,
    });
  });
