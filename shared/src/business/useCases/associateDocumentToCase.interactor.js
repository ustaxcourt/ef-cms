const User = require('../entities/User');
const { fileDocument } = require('./utilities/fileDocument');
const {
  getCaseEntityForUpload,
} = require('./utilities/getCaseEntityForUpload');

exports.associateDocumentToCase = async ({
  applicationContext,
  caseId,
  documentType,
  documentId,
  userId,
}) => {
  const user = new User({ userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      caseId,
      applicationContext,
    });

  const caseEntity = getCaseEntityForUpload({
    caseToUpdate,
    documentId,
    documentType,
    user,
  });

  return fileDocument({
    userId,
    caseToUpdate: caseEntity.validate().toRawObject(),
    isRespondentDocument: false,
    applicationContext,
  });
};
