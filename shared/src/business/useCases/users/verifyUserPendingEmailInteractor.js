const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * verifyUserPendingEmailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
 */
exports.verifyUserPendingEmailInteractor = async ({
  applicationContext,
  token,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const userEntity = new User(user);

  // TODO: fix this Potential timing attack
  if (
    !userEntity.pendingEmailVerificationToken ||
    userEntity.pendingEmailVerificationToken !== token
  ) {
    throw new UnauthorizedError('Tokens do not match');
  }

  await applicationContext.getPersistenceGateway().updateUserEmail({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  userEntity.email = userEntity.pendingEmail;
  userEntity.pendingEmail = undefined;
  userEntity.pendingEmailVerificationToken = undefined;

  const updatedRawUser = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedRawUser,
  });

  // update all the cases with their new contact info
};
