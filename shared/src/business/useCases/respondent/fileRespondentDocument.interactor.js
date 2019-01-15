const {
  isAuthorized,
  FILE_RESPONDENT_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.fileRespondentDocument = async ({
  userId,
  caseToUpdate,
  document,
  documentType,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_RESPONDENT_DOCUMENT)) {
    throw new UnauthorizedError(`Unauthorized to upload a ${documentType}`);
  }

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  await applicationContext.getUseCases().createDocument({
    userId,
    document: {
      documentType,
      documentId,
    },
    caseId: caseToUpdate.caseId,
    applicationContext,
  });
};
