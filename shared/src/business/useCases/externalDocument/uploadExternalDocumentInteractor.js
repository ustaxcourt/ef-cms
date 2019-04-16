const {
  isAuthorized,
  FILE_EXTERNAL_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocument = async ({
  documentMetadata,
  primaryDocumentFile,
  secondaryDocumentFile,
  supportingDocumentFile,
  secondarySupportingDocumentFile,
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
    });

  let secondaryDocumentFileId;
  if (secondaryDocumentFile) {
    secondaryDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: secondaryDocumentFile,
      });
  }

  let supportingDocumentFileId;
  if (supportingDocumentFile) {
    supportingDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: supportingDocumentFile,
      });
  }

  let secondarySupportingDocumentFileId;
  if (secondarySupportingDocumentFile) {
    secondarySupportingDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: secondarySupportingDocumentFile,
      });
  }

  return await applicationContext.getUseCases().fileExternalDocument({
    applicationContext,
    documentMetadata,
    primaryDocumentFileId,
    secondaryDocumentFileId,
    secondarySupportingDocumentFileId,
    supportingDocumentFileId,
  });
};
