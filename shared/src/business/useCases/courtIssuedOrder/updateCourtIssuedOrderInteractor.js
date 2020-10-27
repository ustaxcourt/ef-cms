const {
  DOCUMENT_RELATIONSHIPS,
  ORDER_TYPES,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketEntryIdToEdit the id of the docket entry to update
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the updated case entity after the document is updated
 */
exports.updateCourtIssuedOrderInteractor = async ({
  applicationContext,
  docketEntryIdToEdit,
  documentMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocument = caseEntity.getDocketEntryById({
    docketEntryId: docketEntryIdToEdit,
  });

  if (!currentDocument) {
    throw new NotFoundError('Document not found');
  }

  const orderTypeEventCodes = Object.values(ORDER_TYPES).map(d => d.eventCode);

  if (orderTypeEventCodes.includes(documentMetadata.eventCode)) {
    documentMetadata.freeText = documentMetadata.documentTitle;
    if (documentMetadata.draftOrderState) {
      documentMetadata.draftOrderState.freeText =
        documentMetadata.documentTitle;
    }
  }

  if (documentMetadata.documentContents) {
    const { documentContentsId } = currentDocument;

    const contentToStore = {
      documentContents: documentMetadata.documentContents,
      richText: documentMetadata.draftOrderState.richText,
    };

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: Buffer.from(JSON.stringify(contentToStore)),
      key: documentContentsId,
      useTempBucket: false,
    });

    delete documentMetadata.documentContents;
    delete documentMetadata.draftOrderState.documentContents;
    delete documentMetadata.draftOrderState.richText;
    delete documentMetadata.draftOrderState.editorDelta;
  }

  const editableFields = {
    documentTitle: documentMetadata.documentTitle,
    documentType: documentMetadata.documentType,
    draftOrderState: documentMetadata.draftOrderState,
    freeText: documentMetadata.freeText,
  };

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId: docketEntryIdToEdit,
    });

  const docketEntryEntity = new DocketEntry(
    {
      ...currentDocument,
      ...editableFields,
      docketEntryId: docketEntryIdToEdit,
      filedBy: user.name,
      numberOfPages,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
    },
    { applicationContext },
  );
  docketEntryEntity.setAsProcessingStatusAsCompleted();

  // we always un-sign the order document on updates because the court user will need to sign it again
  docketEntryEntity.unsignDocument();

  caseEntity.updateDocketEntry(docketEntryEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
