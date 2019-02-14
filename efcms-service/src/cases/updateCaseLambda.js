const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for updating a case
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.put = event => {
  return handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUpdateCaseInteractorQueryParam(event)({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body),
      ...JSON.parse(event.body),
      applicationContext,
    });
  });
};
