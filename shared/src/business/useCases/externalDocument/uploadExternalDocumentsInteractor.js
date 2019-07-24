const {
  CREATE_COURT_ISSUED_ORDER,
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocumentsInteractor = async ({
  applicationContext,
  documentFiles,
  onUploadProgresses,
}) => {
  const user = applicationContext.getCurrentUser();

  if (
    !(
      isAuthorized(user, FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(user, CREATE_COURT_ISSUED_ORDER)
    )
  ) {
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
