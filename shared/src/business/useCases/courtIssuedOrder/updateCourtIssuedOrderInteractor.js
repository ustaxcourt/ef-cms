const {
  isAuthorized,
  ROLE_PERMISSIONS,
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

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
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

  const oldDocument = caseEntity.documents.find(
    document => document.documentId === documentIdToEdit,
  );

  if (documentMetadata.documentContents) {
    const { documentContentsId } = oldDocument;

    const contentToStore = {
      documentContents: documentMetadata.documentContents,
      richText: documentMetadata.draftState.richText,
    };

    applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: Buffer.from(JSON.stringify(contentToStore)),
      documentId: documentContentsId,
      useTempBucket: true,
    });

    delete documentMetadata.documentContents;
    delete documentMetadata.draftState.documentContents;
    delete documentMetadata.draftState.richText;
    delete documentMetadata.draftState.editorDelta;
  }

  const editableFields = {
    documentTitle: documentMetadata.documentTitle,
    documentType: documentMetadata.documentType,
    draftState: documentMetadata.draftState,
    freeText: documentMetadata.freeText,
  };

  const documentEntity = new Document(
    {
      ...oldDocument,
      ...editableFields,
      documentId: documentIdToEdit,
      filedBy: user.name,
      relationship: 'primaryDocument',
      userId: user.userId,
    },
    { applicationContext },
  );
  documentEntity.setAsProcessingStatusAsCompleted();

  // we always un-sign the order document on updates because the court user will need to sign it again
  documentEntity.unsignDocument();

  caseEntity.updateDocument(documentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
