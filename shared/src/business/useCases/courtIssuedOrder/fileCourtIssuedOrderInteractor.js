const {
  CREATE_COURT_ISSUED_ORDER,
  EDIT_COURT_ISSUED_ORDER,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the updated case entity after the document is added
 */
exports.fileCourtIssuedOrderInteractor = async ({
  applicationContext,
  documentIdToEdit = null,
  documentMetadata,
  primaryDocumentFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (
    !isAuthorized(authorizedUser, CREATE_COURT_ISSUED_ORDER) &&
    !isAuthorized(authorizedUser, EDIT_COURT_ISSUED_ORDER)
  ) {
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

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const documentEntity = new Document(
    {
      ...documentMetadata,
      relationship: 'primaryDocument',
      documentId: documentIdToEdit || primaryDocumentFileId,
      documentType: documentMetadata.documentType,
      userId: user.userId,
      filedBy: user.name,
    },
    { applicationContext },
  );
  documentEntity.processingStatus = 'complete';

  if (documentIdToEdit) {
    caseEntity.updateDocument(documentEntity);
  } else if (primaryDocumentFileId && documentMetadata) {
    caseEntity.addDocumentWithoutDocketRecord(documentEntity);
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
