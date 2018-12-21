const Case = require('../../entities/Case');

const {
  isAuthorized,
  FILE_ANSWER,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const User = require('../../entities/User');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_ANSWER)) {
    throw new UnauthorizedError('Unauthorized to upload a stipulated decision');
  }

  const user = new User({ userId });

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
          userId,
          filedBy: user.name,
          documentId,
          documentType: Case.documentTypes.answer,
        },
      ],
    },
    applicationContext,
  });
};
