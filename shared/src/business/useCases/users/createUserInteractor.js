const {
  createPractitionerUser,
} = require('../../utilities/createPractitionerUser');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { ROLES } = require('../../entities/EntityConstants');
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

  let userEntity = null;

  if (
    [
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
      ROLES.inactivePractitioner,
    ].includes(user.role)
  ) {
    userEntity = new Practitioner(
      await createPractitionerUser({ applicationContext, user }),
    );
  } else {
    if (user.barNumber === '') {
      delete user.barNumber;
    }
    userEntity = new User(
      { ...user, userId: applicationContext.getUniqueId() },
      { applicationContext },
    );
  }

  await applicationContext.getPersistenceGateway().createUser({
    applicationContext,
    user: {
      ...userEntity.validate().toRawObject(),
      password: user.password,
    },
  });

  return userEntity.validate().toRawObject();
};
