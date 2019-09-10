const {
  CREATE_COURT_ISSUED_ORDER,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadOrderDocumentInteractor = async ({
  applicationContext,
  documentFile,
  documentIdToOverwrite,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CREATE_COURT_ISSUED_ORDER)) {
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
