const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

exports.deleteCorrespondenceDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key: documentId,
  });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  const correspondenceToArchive = caseEntity.correspondences.find(
    c => c.documentId === documentId,
  );

  caseEntity.archiveCorrespondence(correspondenceToArchive, {
    applicationContext,
  });

  await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
    applicationContext,
    docketNumber,
    documentId,
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
