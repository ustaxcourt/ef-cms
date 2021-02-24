const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * getUserPendingEmailInteractor
 * Allows a user to request an update their own email address if they have permission.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
 */
exports.getUserPendingEmailInteractor = async ({
  applicationContext,
  userId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL)) {
    throw new UnauthorizedError('Unauthorized to get user pending email');
  }

  const userRaw = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId,
  });

  const validatedUserRaw = new User(userRaw).validate().toRawObject();

  return validatedUserRaw.pendingEmail;
};
