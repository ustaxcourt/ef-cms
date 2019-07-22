const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionFromPaperInteractor = async ({
  applicationContext,
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

  const petitionFileId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: petitionFile,
      onUploadProgress: petitionUploadProgress,
    });

  let ownershipDisclosureFileId;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: ownershipDisclosureFile,
        onUploadProgress: ownershipDisclosureUploadProgress,
      });
  }

  let stinFileId;
  if (stinFile) {
    stinFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: stinFile,
        onUploadProgress: stinUploadProgress,
      });
  }

  let requestForPlaceOfTrialFileId;
  if (requestForPlaceOfTrialFile) {
    requestForPlaceOfTrialFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: requestForPlaceOfTrialFile,
        onUploadProgress: requestForPlaceOfTrialUploadProgress,
      });
  }

  const documentIds = [
    ownershipDisclosureFileId,
    petitionFileId,
    stinFileId,
    requestForPlaceOfTrialFileId,
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

  return await applicationContext.getUseCases().createCaseFromPaperInteractor({
    applicationContext,
    ownershipDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    requestForPlaceOfTrialFileId,
    stinFileId,
  });
};
