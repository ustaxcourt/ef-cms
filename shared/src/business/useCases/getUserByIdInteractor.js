const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
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

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (
    ![User.ROLES.privatePractitioner, User.ROLES.irsPractitioner].includes(
      user.role,
    )
  ) {
    throw new UnauthorizedError(
      'Unauthorized to retrieve users other than attorneys',
    );
  }

  return new User(user).validate().toRawObject();
};
