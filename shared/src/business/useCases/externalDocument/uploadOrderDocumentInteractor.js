const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadOrderDocumentInteractor = async ({
  applicationContext,
  documentFile,
  documentIdToOverwrite,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const orderDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: documentFile,
      documentId: documentIdToOverwrite,
      onUploadProgress: () => {},
    });

  return orderDocumentId;
};
