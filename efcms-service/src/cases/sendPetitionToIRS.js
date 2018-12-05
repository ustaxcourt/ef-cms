const { sendPetitionToIRS } = require('ef-cms-shared/src/business/useCases/sendPetitionToIRS');
const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * updateCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.post = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    return sendPetitionToIRS({
      caseId: event.pathParameters.caseId,
      userId,
      applicationContext,
    });
  });
