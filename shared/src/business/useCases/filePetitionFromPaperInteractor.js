const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { INITIAL_DOCUMENT_TYPES } = require('../entities/EntityConstants');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionFromPaperInteractor = async ({
  applicationContext,
  applicationForWaiverOfFilingFeeFile,
  applicationForWaiverOfFilingFeeUploadProgress,
  caseDetail,
  ownershipDisclosureFile,
  ownershipDisclosureUploadProgress,
  petitionFile,
  petitionMetadata,
  petitionUploadProgress,
  requestForPlaceOfTrialFile,
  requestForPlaceOfTrialUploadProgress,
  stinFile,
  stinUploadProgress,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  console.log('horze 1');

  /**
   * uploads a document and then immediately processes it to scan for viruses and validate the document.
   *
   * @param {object} document the documentFile
   * @param {Function} onUploadProgress the progressFunction
   * @returns {Promise<string>} the documentId returned from a successful upload
   */
  const uploadDocumentAndMakeSafe = async (document, onUploadProgress) => {
    const documentId = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document,
        onUploadProgress,
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

  console.log('horze 2');

  let applicationForWaiverOfFilingFeeUpload;
  if (applicationForWaiverOfFilingFeeFile) {
    applicationForWaiverOfFilingFeeUpload = uploadDocumentAndMakeSafe(
      applicationForWaiverOfFilingFeeFile,
      applicationForWaiverOfFilingFeeUploadProgress,
    );
  }
  console.log('horze 3');

  let petitionFileUpload;
  if (petitionFile) {
    if (caseDetail) {
      const previousPetitionDocumentId = caseDetail.documents.find(
        doc =>
          doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
      );

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        document: petitionFile,
        documentId: previousPetitionDocumentId,
      });
    } else {
      uploadDocumentAndMakeSafe(petitionFile, petitionUploadProgress);
    }
  }

  let ownershipDisclosureFileUpload;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileUpload = uploadDocumentAndMakeSafe(
      ownershipDisclosureFile,
      ownershipDisclosureUploadProgress,
    );
  }

  // TODO
  // const documentMap = {}
  // loop through documents array on caseEntity
  // recreate map used in client action

  let stinFileUpload;
  console.log('**************', stinFile, caseDetail);
  if (stinFile) {
    if (caseDetail) {
      const previousStinDocumentId = caseDetail.documents.find(
        doc =>
          doc.documentType === INITIAL_DOCUMENT_TYPES.stinFile.documentType,
      );

      console.log('**************', previousStinDocumentId);

      stinFileUpload = await applicationContext
        .getPersistenceGateway()
        .saveDocumentFromLambda({
          applicationContext,
          document: stinFile,
          documentId: previousStinDocumentId,
        });
    } else {
      stinFileUpload = uploadDocumentAndMakeSafe(stinFile, stinUploadProgress);
    }
  }

  console.log('horze 4');

  let requestForPlaceOfTrialFileUpload;
  if (requestForPlaceOfTrialFile) {
    requestForPlaceOfTrialFileUpload = uploadDocumentAndMakeSafe(
      requestForPlaceOfTrialFile,
      requestForPlaceOfTrialUploadProgress,
    );
  }

  await Promise.all([
    applicationForWaiverOfFilingFeeUpload,
    ownershipDisclosureFileUpload,
    petitionFileUpload,
    requestForPlaceOfTrialFileUpload,
    stinFileUpload,
  ]);

  console.log('horze 5');

  if (!caseDetail) {
    return await applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor({
        applicationContext,
        applicationForWaiverOfFilingFeeFileId: await applicationForWaiverOfFilingFeeUpload,
        ownershipDisclosureFileId: await ownershipDisclosureFileUpload,
        petitionFileId: await petitionFileUpload,
        petitionMetadata,
        requestForPlaceOfTrialFileId: await requestForPlaceOfTrialFileUpload,
        stinFileId: await stinFileUpload,
      });
  }
};
