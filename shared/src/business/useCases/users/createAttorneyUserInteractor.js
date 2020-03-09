const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Attorney } = require('../../entities/Attorney');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createAttorneyUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createAttorneyUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for creating attorney user');
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createAttorneyUser({
      applicationContext,
      user,
    });

  return new Attorney(createdUser, { applicationContext })
    .validate()
    .toRawObject();
};
