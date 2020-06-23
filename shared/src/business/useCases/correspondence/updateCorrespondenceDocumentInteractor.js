const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Correspondence } = require('../../entities/Correspondence');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the updated case entity after the correspondence document is updated
 */
exports.updateCorrespondenceDocumentInteractor = async ({
  applicationContext,
  documentMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentCorrespondenceDocument = caseEntity.getDocumentById({
    documentId: documentMetadata.documentId,
  });

  const updatedCorrespondenceEntity = new Correspondence(
    {
      ...currentCorrespondenceDocument,
      documentTitle: documentMetadata.documentTitle,
    },
    { applicationContext },
  );

  caseEntity.updateDocument(updatedCorrespondenceEntity);

  const caseEntityRaw = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().fileCaseCorrespondence({
    applicationContext,
    caseId,
    correspondence: updatedCorrespondenceEntity.validate().toRawObject(),
  });

  return caseEntityRaw;
};
