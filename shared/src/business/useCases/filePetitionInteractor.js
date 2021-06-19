const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionInteractor = async (
  applicationContext,
  {
    ownershipDisclosureFile,
    ownershipDisclosureUploadProgress,
    petitionFile,
    petitionMetadata,
    petitionUploadProgress,
    stinFile,
    stinUploadProgress,
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  /**
   * uploads a document and then immediately processes it to scan for viruses and validate the document.
   *
   * @param {object} document the documentFile
   * @param {Function} onUploadProgress the progressFunction
   * @returns {Promise<string>} the key returned from a successful upload
   */
  const uploadDocumentAndMakeSafeInteractor = async (doc, onUploadProgress) => {
    const key = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: doc,
        onUploadProgress,
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

  const petitionFileUpload = uploadDocumentAndMakeSafeInteractor(
    petitionFile,
    petitionUploadProgress,
  );

  let ownershipDisclosureFileUpload;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileUpload = uploadDocumentAndMakeSafeInteractor(
      ownershipDisclosureFile,
      ownershipDisclosureUploadProgress,
    );
  }

  let stinFileUpload;
  if (stinFile) {
    stinFileUpload = uploadDocumentAndMakeSafeInteractor(
      stinFile,
      stinUploadProgress,
    );
  }

  const [ownershipDisclosureFileId, petitionFileId, stinFileId] =
    await Promise.all([
      ownershipDisclosureFileUpload,
      petitionFileUpload,
      stinFileUpload,
    ]);

  const caseDetail = await applicationContext
    .getUseCases()
    .createCaseInteractor(applicationContext, {
      ownershipDisclosureFileId,
      petitionFileId,
      petitionMetadata,
      stinFileId,
    });

  return {
    caseDetail,
    stinFileId,
  };
};
