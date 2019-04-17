const {
  isAuthorized,
  GET_CASES_BY_STATUS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getCasesByStatus
 * @param status
 * @param userId
 * @param applicationContext
 * @returns {Promise<Promise<*>|*>}
 */
exports.getCasesByStatus = async ({ status, applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, GET_CASES_BY_STATUS)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  status = status.toLowerCase();

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByStatus({
      applicationContext,
      status,
    });
  return Case.validateRawCollection(cases);
};
