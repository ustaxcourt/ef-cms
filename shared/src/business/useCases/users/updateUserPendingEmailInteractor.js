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
 * @param {string} providers.pendingEmail the pending email
 * @returns {Promise} the updated user object
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

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;

  const userEntity = new User(user).validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: userEntity,
  });

  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/verify-email?token=${pendingEmailVerificationToken}`;

  const templateHtml = `The email on your account has been changed.<br>To login with your new email, <a href="${verificationLink}">verify your email</a>.<br>If you did not make this change, no action is required.`;

  const destination = {
    email: pendingEmail,
    templateData: {
      emailContent: templateHtml,
    },
  };

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      emailContent: 'Please confirm your new email',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_CHANGE_VERIFICATION_TEMPLATE,
  });

  return userEntity;
};
