const Case = require('../entities/Case');
const User = require('../entities/User');
const {
  getCaseEntityForUpload,
} = require('./utilities/getCaseEntityForUpload');

const {
  isAuthorized,
  FILE_GENERIC_DOCUMENT,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.fileGenericDocument = async ({
  userId,
  caseToUpdate,
  document,
  documentType,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_GENERIC_DOCUMENT)) {
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
    documentType: Case.documentTypes.answer,
    user,
  });

  await applicationContext.getUseCases().associateRespondentDocumentToCase({
    userId,
    caseToUpdate: caseEntity.validate().toJSON(),
    applicationContext,
  });
};
