const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadCorrespondenceDocumentInteractor = async ({
  applicationContext,
  documentFile,
  documentIdToOverwrite,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const correspondenceDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document: documentFile,
      documentId: documentIdToOverwrite,
      onUploadProgress: () => {},
    });

  return correspondenceDocumentId;
};
