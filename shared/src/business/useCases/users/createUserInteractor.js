const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
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
    user.role === User.ROLES.privatePractitioner ||
    user.role === User.ROLES.irsPractitione ||
    user.role === User.ROLES.inactivePractitioner
  ) {
    const barNumber = await applicationContext.barNumberGenerator.createBarNumber(
      {
        applicationContext,
        initials:
          user.lastName.charAt(0).toUpperCase() +
          user.firstName.charAt(0).toUpperCase(),
      },
    );

    const userId = applicationContext.getUniqueId();

    userEntity = new Practitioner({
      ...user,
      barNumber,
      userId,
    })
      .validate()
      .toRawObject();
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createUser({
      applicationContext,
      user: userEntity,
    });

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};
