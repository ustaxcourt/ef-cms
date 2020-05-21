const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Correspondence } = require('../../entities/Correspondence');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * fileCorrespondenceDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the raw case object
 */
exports.fileCorrespondenceDocumentInteractor = async ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const correspondenceEntity = new Correspondence(
    {
      ...documentMetadata,
      documentId: primaryDocumentFileId,
      filedBy: user.name,
      userId: user.userId,
    },
    { applicationContext },
  );

  caseEntity.fileCorrespondence(correspondenceEntity);

  if (caseEntity.validate()) {
    await applicationContext.getPersistenceGateway().fileCaseCorrespondence({
      applicationContext,
      caseId,
      correspondence: correspondenceEntity.validate().toRawObject(),
    });
  }

  return caseEntity.toRawObject();
};
