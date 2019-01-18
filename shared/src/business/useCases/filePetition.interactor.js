const {
  isAuthorized,
  PETITION,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetition = async ({
  petitionMetadata,
  petitionFile,
  fileHasUploaded,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user.userId, PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const petitionFileId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: petitionFile,
    });

  fileHasUploaded();

  await applicationContext.getUseCases().createCase({
    petitionFileId,
    petitionMetadata,
    applicationContext,
  });
};
