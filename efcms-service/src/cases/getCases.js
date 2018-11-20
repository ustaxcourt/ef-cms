const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

const {
  persistence: { getCasesByUser, getCasesByStatus },
  environment: { stage },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    getCasesByUser,
  },
  environment: {
    stage,
  },
};

/**
 * GET Cases API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = event =>
  handle(() => {
    const status = (event.queryStringParameters || {}).status;
    const userId = getAuthHeader(event);
    return status
      ? getCasesByStatus({ status, userId, applicationContext })
      : getCasesByUser({ userId, applicationContext });
  });
