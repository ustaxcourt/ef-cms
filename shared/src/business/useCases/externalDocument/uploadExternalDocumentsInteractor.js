const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocuments = async ({
  applicationContext,
  documentFiles,
  onUploadProgresses,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  documentFiles = documentFiles || [];
  const documentIds = new Array(documentFiles.length);
  for (let i = 0; i < documentFiles.length; i++) {
    if (documentFiles[i]) {
      const documentId = await applicationContext
        .getPersistenceGateway()
        .uploadDocument({
          applicationContext,
          document: documentFiles[i],
          onUploadProgress: onUploadProgresses[i],
        });
      documentIds[i] = documentId;
    }
  }

  return documentIds;
};
