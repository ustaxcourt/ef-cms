const { getAuthHeader, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 *
 * used for fetching all cases of a particular status, user role, etc
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() => {
    const status = (event.queryStringParameters || {}).status;
    const documentId = (event.queryStringParameters || {}).documentId;
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const useCase = applicationContext.getInteractorForGettingCases({
      user,
      documentId,
      applicationContext,
    });
    return useCase({
      documentId,
      user,
      status: status,
      applicationContext,
    });
  });
