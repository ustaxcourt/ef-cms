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

  const userEntity = new User(user).validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: userEntity,
  });

  const templateHtml =
    'Please confirm your new email: <a href="/verify">Verify</a>';

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
    templateName: process.env.EMAIL_SERVED_PETITION_TEMPLATE,
  });

  return userEntity;
};
