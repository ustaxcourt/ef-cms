const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Uploads external documents and calls the interactor to associate them with one or more cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.documentFiles array of file objects
 * @param {object} providers.documentMetadata metadata associated with the documents/cases
 * @param {string} providers.leadDocketNumber optional docket number representing the lead case in a consolidated set
 * @param {string} providers.progressFunctions callback functions for updating the progress indicator during file upload
 * @returns {Promise<Array>} the case(s) with the uploaded document(s) attached
 */
exports.uploadExternalDocumentsInteractor = async ({
  applicationContext,
  docketNumbersForFiling,
  documentFiles,
  documentMetadata,
  leadDocketNumber,
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
      .uploadDocumentFromClient({
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

  if (leadDocketNumber) {
    return await applicationContext
      .getUseCases()
      .fileExternalDocumentForConsolidatedInteractor({
        applicationContext,
        docketNumbersForFiling,
        documentIds,
        documentMetadata,
        leadDocketNumber,
      });
  } else {
    return await applicationContext
      .getUseCases()
      .fileExternalDocumentInteractor({
        applicationContext,
        documentIds,
        documentMetadata,
      });
  }
};
