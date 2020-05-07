const {
  createPractitionerUser,
} = require('../../utilities/createPractitionerUser');
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

  let userEntity = user;

  if (
    [
      User.ROLES.privatePractitioner,
      User.ROLES.irsPractitioner,
      User.ROLES.inactivePractitioner,
    ].includes(user.role)
  ) {
    userEntity = await createPractitionerUser({ applicationContext, user });
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createUser({
      applicationContext,
      user: userEntity,
    });

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};
