const User = require('../../entities/User');
const {
  getCaseEntityForUpload,
} = require('../utilities/getCaseEntityForUpload');

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

  const user = new User({ userId });

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  const caseEntity = getCaseEntityForUpload({
    caseToUpdate,
    documentId,
    documentType,
    user,
  });

  await applicationContext.getUseCases().associateRespondentDocumentToCase({
    userId,
    caseToUpdate: caseEntity.validate().toJSON(),
    applicationContext,
  });
};
