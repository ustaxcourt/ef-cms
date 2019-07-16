const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocumentInteractor = async ({
  applicationContext,
  documentFiles,
  documentMetadata,
  progressFunctions,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const primaryDocumentFileId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: documentFiles.primary,
      onUploadProgress: progressFunctions.primary,
    });

  let secondaryDocumentFileId;
  if (documentFiles.secondary) {
    secondaryDocumentFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: documentFiles.secondary,
        onUploadProgress: progressFunctions.secondary,
      });
  }

  const supportingDocumentFileIds = [];
  if (documentMetadata.hasSupportingDocuments) {
    for (let i = 0; i < documentMetadata.supportingDocuments.length; i++) {
      const supportingDocumentFileId = await applicationContext
        .getPersistenceGateway()
        .uploadDocument({
          applicationContext,
          document: documentFiles[`primarySupporting${i}`],
          onUploadProgress: progressFunctions[`primarySupporting${i}`],
        });

      supportingDocumentFileIds.push(supportingDocumentFileId);
    }
  }

  const secondarySupportingDocumentFileIds = [];
  if (documentMetadata.hasSecondarySupportingDocuments) {
    for (
      let i = 0;
      i < documentMetadata.secondarySupportingDocuments.length;
      i++
    ) {
      const secondarySupportingDocumentFileId = await applicationContext
        .getPersistenceGateway()
        .uploadDocument({
          applicationContext,
          document: documentFiles[`secondarySupporting${i}`],
          onUploadProgress: progressFunctions[`secondarySupporting${i}`],
        });

      secondarySupportingDocumentFileIds.push(
        secondarySupportingDocumentFileId,
      );
    }
  }

  if (user.role === 'practitioner') {
    documentMetadata.practitioner = [{ ...user, partyPractitioner: true }];
  }

  const documentIds = [
    primaryDocumentFileId,
    secondaryDocumentFileId,
    ...supportingDocumentFileIds,
    ...secondarySupportingDocumentFileIds,
  ].filter(documentId => documentId);

  for (let documentId of documentIds) {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
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
    documentIds,
    documentMetadata,
  });
};
