const {
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
 * @param {object} providers.documentIdToEdit the id of the document to update
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the updated case entity after the document is updated
 */
exports.updateCourtIssuedOrderInteractor = async ({
  applicationContext,
  documentIdToEdit,
  documentMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(authorizedUser, EDIT_COURT_ISSUED_ORDER)) {
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
      documentId: documentIdToEdit,
      documentType: documentMetadata.documentType,
      userId: user.userId,
      filedBy: user.name,
    },
    { applicationContext },
  );
  documentEntity.setAsProcessingStatusAsCompleted();

  // we always unsign the order document on updates because the court user will need to sign it again
  documentEntity.unsignDocument();

  caseEntity.updateDocument(documentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
