const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInternalUsersInteractor
 * @param sectionType
 * @returns {Promise<User[]>}
 */
exports.getInternalUsersInteractor = async ({ applicationContext }) => {
  if (!isAuthorized(applicationContext.getCurrentUser(), WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().getInternalUsers({
    applicationContext,
  });
};
