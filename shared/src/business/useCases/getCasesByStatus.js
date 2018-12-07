const {
  isAuthorized,
  GET_CASES_BY_STATUS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getCasesByStatus
 * @param status
 * @param userId
 * @param applicationContext
 * @returns {Promise<Promise<*>|*>}
 */
exports.getCasesByStatus = async ({ status, userId, applicationContext }) => {
  if (!isAuthorized(userId, GET_CASES_BY_STATUS)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  status = status.toLowerCase();

  return applicationContext.getPersistenceGateway().getCasesByStatus({
    status,
    applicationContext,
  });
};
