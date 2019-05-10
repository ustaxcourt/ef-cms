const {
  isAuthorized,
  FILE_EXTERNAL_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocuments = async ({
  onPrimaryUploadProgress,
  onSecondaryUploadProgress,
  primaryDocumentFile,
  secondaryDocumentFile,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const primaryDocumentFileId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: primaryDocumentFile,
      onUploadProgress: onPrimaryUploadProgress,
    });

  let secondaryDocumentFileId;
  if (secondaryDocumentFile) {
    secondaryDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: secondaryDocumentFile,
        onUploadProgress: onSecondaryUploadProgress,
      });
  }

  return [primaryDocumentFileId, secondaryDocumentFileId];
};
