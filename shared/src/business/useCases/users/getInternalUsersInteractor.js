const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInternalUsersInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<User[]>} the internal users
 */
exports.getInternalUsersInteractor = async ({ applicationContext }) => {
  if (
    !isAuthorized(
      applicationContext.getCurrentUser(),
      ROLE_PERMISSIONS.WORKITEM,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().getInternalUsers({
    applicationContext,
  });
};
