const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateUserPendingEmailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pendingEmail the contactInfo to update the pendingEmail
 * @param {string} providers.userId the userId to update the pendingEmail
 * @returns {Promise} an object is successful
 */
exports.updateUserPendingEmailInteractor = async ({
  applicationContext,
  pendingEmail,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  user.pendingEmail = pendingEmail;

  const userEntity = new User(user);

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });

  return new User(updatedUser).validate().toRawObject();
};
