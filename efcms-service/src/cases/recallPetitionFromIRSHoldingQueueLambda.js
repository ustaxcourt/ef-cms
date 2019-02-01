const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for sending the case to the irs
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.delete = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().recallPetitionFromIRSHoldingQueue({
      caseId: event.pathParameters.caseId,
      userId,
      applicationContext,
    });
  });
