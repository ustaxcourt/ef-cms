//TODO remove
const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetition = async ({
  petitionMetadata,
  petitionFile,
  ownershipDisclosureFile,
  fileHasUploaded,
  applicationContext,
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
    });
  fileHasUploaded();

  let ownershipDisclosureFileId;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: ownershipDisclosureFile,
      });
    fileHasUploaded();
  }

  await applicationContext.getUseCases().createCase({
    petitionFileId,
    ownershipDisclosureFileId,
    petitionMetadata,
    applicationContext,
  });
};
