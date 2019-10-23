const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionFromPaperInteractor = async ({
  applicationContext,
  applicationForWaiverOfFilingFeeFile,
  applicationForWaiverOfFilingFeeUploadProgress,
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

  if (!isAuthorized(user, START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  /**
   * uploads a document and then immediately processes it to validate the document.
   *
   * @param {object} document the documentFile
   * @param {func} onUploadProgress the progressFunction
   * @returns {Promise<string>} the documentId returned from a successful upload
   */
  const uploadDocumentAndMakeSafe = async (document, onUploadProgress) => {
    const documentId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document,
        onUploadProgress,
      });
    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });
    return documentId;
  };

  let applicationForWaiverOfFilingFeeUpload;
  if (applicationForWaiverOfFilingFeeFile) {
    applicationForWaiverOfFilingFeeUpload = uploadDocumentAndMakeSafe(
      applicationForWaiverOfFilingFeeFile,
      applicationForWaiverOfFilingFeeUploadProgress,
    );
  }

  const petitionFileUpload = uploadDocumentAndMakeSafe(
    petitionFile,
    petitionUploadProgress,
  );

  let ownershipDisclosureFileUpload;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileUpload = uploadDocumentAndMakeSafe(
      ownershipDisclosureFile,
      ownershipDisclosureUploadProgress,
    );
  }

  let stinFileUpload;
  if (stinFile) {
    stinFileUpload = uploadDocumentAndMakeSafe(stinFile, stinUploadProgress);
  }

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

  return await applicationContext.getUseCases().createCaseFromPaperInteractor({
    applicationContext,
    applicationForWaiverOfFilingFeeFileId: await applicationForWaiverOfFilingFeeUpload,
    ownershipDisclosureFileId: await ownershipDisclosureFileUpload,
    petitionFileId: await petitionFileUpload,
    petitionMetadata,
    requestForPlaceOfTrialFileId: await requestForPlaceOfTrialFileUpload,
    stinFileId: await stinFileUpload,
  });
};
