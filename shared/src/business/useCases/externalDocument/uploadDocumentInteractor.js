const {
  isAuthorized,
  ROLE_PERMISSIONS,
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
      isAuthorized(user, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(user, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT) ||
      isAuthorized(user, ROLE_PERMISSIONS.DOCKET_ENTRY)
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
