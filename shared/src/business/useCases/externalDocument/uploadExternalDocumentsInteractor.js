const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Uploads external documents and calls the interactor to associate them with one or more cases
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.documentFiles array of file objects
 * @param {object} providers.documentMetadata metadata associated with the documents/cases
 * @param {string} providers.leadDocketNumber optional docket number representing the lead case in a consolidated set
 * @param {string} providers.progressFunctions callback functions for updating the progress indicator during file upload
 * @returns {Promise<Array>} the case(s) with the uploaded document(s) attached
 */
exports.uploadExternalDocumentsInteractor = async (
  applicationContext,
  {
    docketNumbersForFiling,
    documentFiles,
    documentMetadata,
    leadDocketNumber,
    progressFunctions,
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketEntryIdsAdded = [];

  /**
   * uploads a document and then immediately processes it to scan for viruses and validate the document
   *
   * @param {string} documentLabel the string identifying which documentFile and progressFunction
   * @returns {Promise<string>} the key returned from a successful upload
   */
  const uploadDocumentAndMakeSafeInteractor = async documentLabel => {
    const key = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: documentFiles[documentLabel],
        onUploadProgress: progressFunctions[documentLabel],
      });

    await applicationContext
      .getUseCases()
      .virusScanPdfInteractor(applicationContext, {
        key,
      });
    await applicationContext
      .getUseCases()
      .validatePdfInteractor(applicationContext, {
        key,
      });

    return key;
  };

  documentMetadata.primaryDocumentId =
    await uploadDocumentAndMakeSafeInteractor('primary');
  docketEntryIdsAdded.push(documentMetadata.primaryDocumentId);

  if (documentFiles.secondary) {
    documentMetadata.secondaryDocument.docketEntryId =
      await uploadDocumentAndMakeSafeInteractor('secondary');
    docketEntryIdsAdded.push(documentMetadata.secondaryDocument.docketEntryId);
  }

  if (documentMetadata.hasSupportingDocuments) {
    for (let i = 0; i < documentMetadata.supportingDocuments.length; i++) {
      documentMetadata.supportingDocuments[i].docketEntryId =
        await uploadDocumentAndMakeSafeInteractor(`primarySupporting${i}`);
      docketEntryIdsAdded.push(
        documentMetadata.supportingDocuments[i].docketEntryId,
      );
    }
  }

  if (documentMetadata.hasSecondarySupportingDocuments) {
    for (
      let i = 0;
      i < documentMetadata.secondarySupportingDocuments.length;
      i++
    ) {
      documentMetadata.secondarySupportingDocuments[i].docketEntryId =
        await uploadDocumentAndMakeSafeInteractor(`secondarySupporting${i}`);
      docketEntryIdsAdded.push(
        documentMetadata.secondarySupportingDocuments[i].docketEntryId,
      );
    }
  }

  if (leadDocketNumber) {
    return {
      caseDetail: await applicationContext
        .getUseCases()
        .fileExternalDocumentForConsolidatedInteractor(applicationContext, {
          docketNumbersForFiling,
          documentMetadata,
          leadDocketNumber,
        }),
      docketEntryIdsAdded,
    };
  } else {
    return {
      caseDetail: await applicationContext
        .getUseCases()
        .fileExternalDocumentInteractor(applicationContext, {
          documentMetadata,
        }),
      docketEntryIdsAdded,
    };
  }
};
