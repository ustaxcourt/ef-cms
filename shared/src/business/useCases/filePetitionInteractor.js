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
  stinFile,
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

  let ownershipDisclosureFileId;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: ownershipDisclosureFile,
      });
  }

  let stinFileId;
  if (stinFile) {
    stinFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: stinFile,
      });
  }

  await applicationContext.getUseCases().createCase({
    applicationContext,
    ownershipDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    stinFileId,
  });
};
