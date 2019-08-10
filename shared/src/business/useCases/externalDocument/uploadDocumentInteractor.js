const {
  CREATE_COURT_ISSUED_ORDER,
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
  console.log('we are here');

  if (
    !(
      isAuthorized(user, FILE_EXTERNAL_DOCUMENT) ||
      isAuthorized(user, CREATE_COURT_ISSUED_ORDER)
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    document: documentFile,
    documentId,
    onUploadProgress,
  });
};
