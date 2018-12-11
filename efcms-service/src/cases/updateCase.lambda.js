const { updateCase } = require('ef-cms-shared/src/business/useCases/updateCase');
const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * updateCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.put = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    return updateCase({
      caseId: event.pathParameters.caseId,
      caseJson: JSON.parse(event.body),
      userId,
      applicationContext,
    });
  });
