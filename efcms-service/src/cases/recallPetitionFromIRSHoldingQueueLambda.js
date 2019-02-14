const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for sending the case to the irs
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.delete = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().recallPetitionFromIRSHoldingQueue({
      caseId: event.pathParameters.caseId,
      applicationContext,
    });
  });
