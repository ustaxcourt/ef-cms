const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateAttorneyUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.updateAttorneyUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for updating attorney user');
  }

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updateAttorneyUser({
      applicationContext,
      user,
    });

  return new User(updatedUser, { applicationContext }).validate().toRawObject();
};
