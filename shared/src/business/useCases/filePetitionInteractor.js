const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetition = async ({
  petitionMetadata,
  petitionFile,
  ownershipDisclosureFile,
  stinFile,
  applicationContext,
  ownershipDisclosureUploadProgress,
  petitionUploadProgress,
  stinUploadProgress,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, PETITION)) {
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

  return await applicationContext.getUseCases().createCase({
    applicationContext,
    ownershipDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    stinFileId,
  });
};
