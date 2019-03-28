const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionFromPaper = async ({
  petitionMetadata,
  petitionFile,
  ownershipDisclosureFile,
  stinFile,
  applicationContext,
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

  return await applicationContext.getUseCases().createCaseFromPaper({
    applicationContext,
    ownershipDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    stinFileId,
  });
};
