const {
  isAuthorized,
  GET_CASES_BY_STATUS,
} = require('../authorization/authorizationClientService');
const { UnauthorizedError } = require('../errors/errors');

exports.getCasesByStatus = async ({ status, userId, applicationContext }) => {
  if (!isAuthorized(userId, GET_CASES_BY_STATUS)) {
    throw new UnauthorizedError('Unauthorized for getCasesByStatus');
  }

  status = status.toLowerCase();

  return applicationContext.persistence.getCasesByStatus({
    status,
    applicationContext,
  });
};
