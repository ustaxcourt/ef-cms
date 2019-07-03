const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocument = async ({
  applicationContext,
  documentMetadata,
  onPrimarySupportingUploadProgress,
  onPrimaryUploadProgress,
  onSecondarySupportUploadProgress,
  onSecondaryUploadProgress,
  primaryDocumentFile,
  secondaryDocumentFile,
  secondarySupportingDocumentFile,
  supportingDocumentFile,
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
      onUploadProgress: onPrimaryUploadProgress,
    });

  let secondaryDocumentFileId;
  if (secondaryDocumentFile) {
    secondaryDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: secondaryDocumentFile,
        onUploadProgress: onSecondaryUploadProgress,
      });
  }

  let supportingDocumentFileId;
  if (supportingDocumentFile) {
    supportingDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: supportingDocumentFile,
        onUploadProgress: onPrimarySupportingUploadProgress,
      });
  }

  let secondarySupportingDocumentFileId;
  if (secondarySupportingDocumentFile) {
    secondarySupportingDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: secondarySupportingDocumentFile,
        onUploadProgress: onSecondarySupportUploadProgress,
      });
  }

  if (user.role === 'practitioner') {
    documentMetadata.practitioner = [{ ...user, partyPractitioner: true }];
  }

  const documentIds = [
    primaryDocumentFileId,
    secondaryDocumentFileId,
    supportingDocumentFileId,
    secondarySupportingDocumentFileId,
  ].filter(documentId => documentId);

  for (let documentId of documentIds) {
    await applicationContext.getUseCases().virusScanPdf({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdf({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().sanitizePdfInteractor({
      applicationContext,
      documentId,
    });
  }

  return await applicationContext.getUseCases().fileExternalDocumentInteractor({
    applicationContext,
    documentMetadata,
    primaryDocumentFileId,
    secondaryDocumentFileId,
    secondarySupportingDocumentFileId,
    supportingDocumentFileId,
  });
};
