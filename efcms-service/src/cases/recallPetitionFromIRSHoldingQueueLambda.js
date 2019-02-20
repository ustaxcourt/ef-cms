const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for recalling the case from the irs holding queue
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
      applicationContext,
    });
  });
