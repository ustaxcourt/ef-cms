const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.deleteCorrespondenceDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().deleteDocument({
    applicationContext,
    key: documentId,
  });

  await applicationContext.getPersistenceGateway().deleteCaseCorrespondence({
    applicationContext,
    caseId,
    documentId,
  });
};
