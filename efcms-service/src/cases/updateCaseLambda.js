const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * used for updating a case
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event => {
  return handle(event, () => {
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
