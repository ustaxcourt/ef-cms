const {
  isAuthorized,
  FILE_RESPONDENT_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param userId
 * @param caseToUpdate
 * @param document
 * @param documentType
 * @param applicationContext
 * @returns {Promise<void>}
 */
exports.fileRespondentDocument = async ({
  caseToUpdate,
  document,
  documentType,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, FILE_RESPONDENT_DOCUMENT)) {
    throw new UnauthorizedError(`Unauthorized to upload a ${documentType}`);
  }

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  await applicationContext.getUseCases().createDocument({
    document: {
      documentType,
      documentId,
    },
    caseId: caseToUpdate.caseId,
    applicationContext,
  });
};
