const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updateUserPendingEmailInteractor
 * Allows a user to request an update their own email address if they have permission.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
 */
exports.updateUserPendingEmailInteractor = async (
  applicationContext,
  { pendingEmail },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const isEmailAvailable = await applicationContext
    .getPersistenceGateway()
    .isEmailAvailable({
      applicationContext,
      email: pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  user.pendingEmail = pendingEmail;

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;

  let updatedUserRaw;
  if (user.role === ROLES.petitioner) {
    updatedUserRaw = new User(user).validate().toRawObject();
  } else {
    updatedUserRaw = new Practitioner(user).validate().toRawObject();
  }

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedUserRaw,
  });

  await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
    applicationContext,
    pendingEmail,
    pendingEmailVerificationToken,
  });

  return updatedUserRaw;
};
