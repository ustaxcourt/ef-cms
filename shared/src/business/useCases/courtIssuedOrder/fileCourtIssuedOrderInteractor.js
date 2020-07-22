const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CaseMessage } = require('../../entities/CaseMessage');
const { Document } = require('../../entities/Document');
const { DOCUMENT_RELATIONSHIPS } = require('../../entities/EntityConstants');
const { orderBy } = require('lodash');
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
  documentMetadata,
  primaryDocumentFileId,
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

  const shouldScrapePDFContents = !documentMetadata.documentContents;

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (['O', 'NOT'].includes(documentMetadata.eventCode)) {
    documentMetadata.freeText = documentMetadata.documentTitle;
  }

  if (shouldScrapePDFContents) {
    const { Body: pdfBuffer } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: primaryDocumentFileId,
      })
      .promise();

    const arrayBuffer = new ArrayBuffer(pdfBuffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < pdfBuffer.length; ++i) {
      view[i] = pdfBuffer[i];
    }

    // TODO: Wait to hear from Jessica on what should happen for PDF scraping failures
    try {
      const contents = await applicationContext
        .getUtilities()
        .scrapePdfContents({ applicationContext, pdfBuffer: arrayBuffer });

      if (contents) {
        documentMetadata.documentContents = contents;
      }
    } catch (e) {
      applicationContext.logger.info('Failed to parse PDF', e);
      throw e;
    }
  }

  if (documentMetadata.documentContents) {
    const documentContentsId = applicationContext.getUniqueId();

    const contentToStore = {
      documentContents: documentMetadata.documentContents,
      richText: documentMetadata.draftState
        ? documentMetadata.draftState.richText
        : undefined,
    };

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: Buffer.from(JSON.stringify(contentToStore)),
      documentId: documentContentsId,
      useTempBucket: false,
    });

    if (documentMetadata.draftState) {
      delete documentMetadata.draftState.documentContents;
      delete documentMetadata.draftState.richText;
      delete documentMetadata.draftState.editorDelta;
    }

    delete documentMetadata.documentContents;
    documentMetadata.documentContentsId = documentContentsId;
  }

  const documentEntity = new Document(
    {
      ...documentMetadata,
      documentId: primaryDocumentFileId,
      documentType: documentMetadata.documentType,
      filedBy: user.name,
      isDraft: true,
      isFileAttached: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
    },
    { applicationContext },
  );
  documentEntity.setAsProcessingStatusAsCompleted();

  caseEntity.addDocumentWithoutDocketRecord(documentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  if (documentMetadata.parentMessageId) {
    const messages = await applicationContext
      .getPersistenceGateway()
      .getCaseMessageThreadByParentId({
        applicationContext,
        parentMessageId: documentMetadata.parentMessageId,
      });

    const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

    const caseMessageEntity = new CaseMessage(mostRecentMessage, {
      applicationContext,
    }).validate();
    caseMessageEntity.addAttachment({
      documentId: documentEntity.documentId,
      documentTitle: documentEntity.documentTitle,
    });

    await applicationContext.getPersistenceGateway().updateCaseMessage({
      applicationContext,
      caseMessage: caseMessageEntity.validate().toRawObject(),
    });
  }

  return caseEntity.toRawObject();
};
