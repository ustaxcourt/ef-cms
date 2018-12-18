const Case = require('../../entities/Case');

const {
  isAuthorized,
  FILE_ANSWER,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_ANSWER)) {
    throw new UnauthorizedError('Unauthorized to upload a stipulated decision');
  }

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  await applicationContext.getUseCases().associateRespondentDocumentToCase({
    userId,
    caseToUpdate: {
      ...caseToUpdate,
      documents: [
        ...(caseToUpdate.documents || []),
        {
          documentId,
          documentType: Case.documentTypes.answer,
        },
      ],
    },
    applicationContext,
  });
};
