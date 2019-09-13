const {
  isAuthorized,
  UPLOAD_DOCUMENT,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

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

  if (!isAuthorized(user, UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // we don't want external users to be able to overwrite existing s3 files
  if (user.isExternalUser()) {
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
