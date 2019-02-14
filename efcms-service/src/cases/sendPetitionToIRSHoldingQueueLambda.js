const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for sending the case to the irs
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.post = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().sendPetitionToIRSHoldingQueue({
      caseId: event.pathParameters.caseId,
      applicationContext,
    });
  });
