const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * getPractitionerByBarNumberInteractor
 *
 * @param {object} userId the id for the user to get
 * @returns {User} the retrieved user
 */
exports.getPractitionerByBarNumberInteractor = async ({
  applicationContext,
  barNumber,
}) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for getting attorney user');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getPractitionerByBarNumber({ applicationContext, barNumber });

  if (!user) {
    throw new NotFoundError(
      'No practitioner with the given bar number was found',
    );
  }

  return new User(user).validate().toRawObject();
};
