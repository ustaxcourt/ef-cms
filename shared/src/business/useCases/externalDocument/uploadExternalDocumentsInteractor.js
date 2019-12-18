const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocumentsInteractor = async ({
  applicationContext,
  documentFiles,
  documentMetadata,
  progressFunctions,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const uploadedDocumentPromises = [];

  /**
   * uploads a document and then immediately processes it to scan for viruses and validate the document
   *
   * @param {string} documentLabel the string identifying which documentFile and progressFunction
   * @returns {Promise<string>} the documentId returned from a successful upload
   */
  const uploadDocumentAndMakeSafe = async documentLabel => {
    const documentId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: documentFiles[documentLabel],
        onUploadProgress: progressFunctions[documentLabel],
      });

    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });
    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });

    return documentId;
  };

  uploadedDocumentPromises.push(uploadDocumentAndMakeSafe('primary'));

  if (documentFiles.secondary) {
    uploadedDocumentPromises.push(uploadDocumentAndMakeSafe('secondary'));
  }

  if (documentMetadata.hasSupportingDocuments) {
    for (let i = 0; i < documentMetadata.supportingDocuments.length; i++) {
      uploadedDocumentPromises.push(
        uploadDocumentAndMakeSafe(`primarySupporting${i}`),
      );
    }
  }

  if (documentMetadata.hasSecondarySupportingDocuments) {
    for (
      let i = 0;
      i < documentMetadata.secondarySupportingDocuments.length;
      i++
    ) {
      uploadedDocumentPromises.push(
        uploadDocumentAndMakeSafe(`secondarySupporting${i}`),
      );
    }
  }

  const documentIds = await Promise.all(uploadedDocumentPromises);

  return await applicationContext.getUseCases().fileExternalDocumentInteractor({
    applicationContext,
    documentIds,
    documentMetadata,
  });
};
