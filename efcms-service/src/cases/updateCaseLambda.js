const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for updating a case
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.put = event => {
  return handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUpdateCaseInteractorQueryParam(event)({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body),
      ...JSON.parse(event.body),
      userId,
      applicationContext,
    });
  });
};
