const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * deleteDraftDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which a document will be deleted
 * @param {string} providers.documentId the id of the document which will be deleted
 * @returns {object} the updated case returned from persistence
 */
exports.deleteDraftDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ARCHIVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  caseEntity.documents = caseEntity.documents.filter(
    item => item.documentId !== documentId,
  );

  await applicationContext.getPersistenceGateway().deleteDocument({
    applicationContext,
    docketNumber: caseEntity.docketNumber,
    documentId,
  });

  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key: documentId,
  });

  const validatedRawCase = caseEntity.validate().toRawObject();

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: validatedRawCase,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
