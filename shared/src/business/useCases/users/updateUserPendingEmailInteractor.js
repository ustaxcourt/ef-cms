const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Practitioner } = require('../../entities/Practitioner');
const { UnauthorizedError } = require('../../../errors/errors');

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

  const updatedRawPractitioner = new Practitioner(user)
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedRawPractitioner,
  });

  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/verify-email?token=${pendingEmailVerificationToken}`;

  const templateHtml = `The email on your account has been changed. Once verified, this email will be your log in and where you will receive service.<br><a href="${verificationLink}">Verify your email.</a><br>If you did not make this change, please contact support at <a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.`;

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

  return updatedRawPractitioner;
};
