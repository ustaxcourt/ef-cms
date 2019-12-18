const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');
const { User } = require('../entities/User');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Array<string>} the filing type options based on user role
 */
exports.getUploadPolicyInteractor = async ({
  applicationContext,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // we don't want external users to be able to overwrite existing s3 files
  if (User.isExternalUser(user.role)) {
    const isFileExists = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        documentId,
      });

    if (isFileExists) {
      throw new Error('Unauthorized');
    }
  }

  return applicationContext.getPersistenceGateway().getUploadPolicy({
    applicationContext,
    documentId,
  });
};
