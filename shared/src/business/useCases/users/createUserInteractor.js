const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.CREATE_USER)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return await applicationContext.getPersistenceGateway().createUser({
    applicationContext,
    user,
  });
};
