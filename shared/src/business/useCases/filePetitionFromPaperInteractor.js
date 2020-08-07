const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * uploads a document and then immediately processes it to scan for viruses and validate the document.
 *
 * @param {object} document the documentFile
 * @param {Function} onUploadProgress the progressFunction
 * @returns {Promise<string>} the documentId returned from a successful upload
 */
export const uploadDocumentAndMakeSafe = async ({
  applicationContext,
  document,
  onUploadProgress,
}) => {
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

export const filePetitionFromPaperInteractor = async ({
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

  if (!isAuthorized(user, ROLE_PERMISSIONS.START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let applicationForWaiverOfFilingFeeUpload;
  if (applicationForWaiverOfFilingFeeFile) {
    applicationForWaiverOfFilingFeeUpload = uploadDocumentAndMakeSafe({
      applicationContext,
      document: applicationForWaiverOfFilingFeeFile,
      onUploadProgress: applicationForWaiverOfFilingFeeUploadProgress,
    });
  }

  const petitionFileUpload = uploadDocumentAndMakeSafe({
    applicationContext,
    document: petitionFile,
    onUploadProgress: petitionUploadProgress,
  });

  let ownershipDisclosureFileUpload;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileUpload = uploadDocumentAndMakeSafe({
      applicationContext,
      document: ownershipDisclosureFile,
      onUploadProgress: ownershipDisclosureUploadProgress,
    });
  }

  let stinFileUpload;
  if (stinFile) {
    stinFileUpload = uploadDocumentAndMakeSafe({
      applicationContext,
      document: stinFile,
      onUploadProgress: stinUploadProgress,
    });
  }

  let requestForPlaceOfTrialFileUpload;
  if (requestForPlaceOfTrialFile) {
    requestForPlaceOfTrialFileUpload = uploadDocumentAndMakeSafe({
      applicationContext,
      document: requestForPlaceOfTrialFile,
      onUploadProgress: requestForPlaceOfTrialUploadProgress,
    });
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
