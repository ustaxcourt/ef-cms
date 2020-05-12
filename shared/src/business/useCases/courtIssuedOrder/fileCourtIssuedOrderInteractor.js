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

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (['O', 'NOT'].includes(documentMetadata.eventCode)) {
    documentMetadata.freeText = documentMetadata.documentTitle;
  }

  if (!documentMetadata.documentContents) {
    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: primaryDocumentFileId,
      })
      .promise();

    try {
      const parsedDocument = await applicationContext
        .getPdfParser()
        .parse(pdfData);

      if (parsedDocument.text) {
        documentMetadata.documentContents = parsedDocument.text;
      }
    } catch (e) {
      applicationContext.logger.info('Failed to parse PDF', e);
      throw e;
    }
  }

  const documentContentsId = applicationContext.getUniqueId();

  const contentToStore = {
    documentContents: documentMetadata.documentContents,
    richText: documentMetadata.draftState
      ? documentMetadata.draftState.richText
      : undefined,
  };

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    contentType: 'text/plain',
    document: Buffer.from(JSON.stringify(contentToStore)),
    documentId: documentContentsId,
    useTempBucket: true,
  });

  if (documentMetadata.draftState) {
    delete documentMetadata.draftState.documentContents;
    delete documentMetadata.draftState.richText;
    delete documentMetadata.draftState.editorDelta;
  }

  delete documentMetadata.documentContents;
  documentMetadata.documentContentsId = documentContentsId;

  const documentEntity = new Document(
    {
      ...documentMetadata,
      documentId: primaryDocumentFileId,
      documentType: documentMetadata.documentType,
      filedBy: user.name,
      relationship: 'primaryDocument',
      userId: user.userId,
    },
    { applicationContext },
  );
  documentEntity.setAsProcessingStatusAsCompleted();

  if (documentMetadata.eventCode === 'NOT') {
    documentEntity.setSigned(authorizedUser.userId);
  }

  caseEntity.addDocumentWithoutDocketRecord(documentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
