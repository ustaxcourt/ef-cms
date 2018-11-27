const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const {
  getCasesByStatus: byStatus,
} = require('ef-cms-shared/src/useCases/getCasesByStatus');
const {
  getCasesByUser: byUser,
} = require('ef-cms-shared/src/useCases/getCasesByUser');

const {
  persistence: { getCasesByUser, getCasesByStatus },
  environment: { stage },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    getCasesByUser,
    getCasesByStatus,
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
      ? byStatus({ status, userId, applicationContext })
      : byUser({ userId, applicationContext });
  });
