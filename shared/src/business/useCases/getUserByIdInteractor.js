const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { ROLES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

/**
 * getUserByIdInteractor
 *
 * @param {object} userId the id for the user to get
 * @returns {User} the retrieved user
 */
exports.getUserByIdInteractor = async ({ applicationContext, userId }) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting practitioner user');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (![ROLES.privatePractitioner, ROLES.irsPractitioner].includes(user.role)) {
    throw new UnauthorizedError(
      'Unauthorized to retrieve users other than practitioners',
    );
  }

  return new User(user).validate().toRawObject();
};
