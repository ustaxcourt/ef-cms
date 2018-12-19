const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * GET Cases API Lambda
 *
 * @param event
 */

exports.get = event =>
  handle(() => {
    const status = (event.queryStringParameters || {}).status;
    const documentId = (event.queryStringParameters || {}).documentId;
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    const useCase = applicationContext.getInteractorForGettingCases({
      userId,
      documentId,
      applicationContext
    });
    return useCase({ documentId, userId: userId, status: status, applicationContext});
  });
