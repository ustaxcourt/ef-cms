const {
  CREATE_COURT_ISSUED_ORDER,
  DOCKET_ENTRY,
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadDocumentInteractor = async ({
  applicationContext,
  documentFile,
  documentId,
  onUploadProgress,
}) => {
  const user = applicationContext.getCurrentUser();

  if (
    !(
      isAuthorized(user, FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(user, CREATE_COURT_ISSUED_ORDER) ||
      isAuthorized(user, DOCKET_ENTRY)
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    document: documentFile,
    documentId,
    onUploadProgress,
  });
};
