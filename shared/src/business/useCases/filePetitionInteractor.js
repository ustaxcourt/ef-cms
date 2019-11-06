const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionInteractor = async ({
  applicationContext,
  ownershipDisclosureFile,
  ownershipDisclosureUploadProgress,
  petitionFile,
  petitionMetadata,
  petitionUploadProgress,
  stinFile,
  stinUploadProgress,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

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
      .uploadDocument({
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

  await Promise.all([
    ownershipDisclosureFileUpload,
    petitionFileUpload,
    stinFileUpload,
  ]);

  return await applicationContext.getUseCases().createCaseInteractor({
    applicationContext,
    ownershipDisclosureFileId: await ownershipDisclosureFileUpload,
    petitionFileId: await petitionFileUpload,
    petitionMetadata,
    stinFileId: await stinFileUpload,
  });
};
