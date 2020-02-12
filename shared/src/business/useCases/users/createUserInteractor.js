const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

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

  const userEntity = new User(user, { applicationContext });
  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};
