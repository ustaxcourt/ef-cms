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

  const numberOfPages = await applicationContext
    .getPersistenceGateway()
    .countPagesInDocument({
      applicationContext,
      documentId: primaryDocumentFileId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (['O', 'NOT'].includes(documentMetadata.eventCode)) {
    documentMetadata.freeText = documentMetadata.documentTitle;
  }

  /* eslint-disable spellcheck/spell-checker */
  /* POC for #4814 - leaving here for future work
  if (!documentMetadata.documentContents) {
    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: primaryDocumentFileId,
      })
      .promise();

    try {
      const parsedDocument = await pdfParse(pdfData);

      if (parsedDocument.text) {
        documentMetadata.documentContents = parsedDocument.text;
      }
    } catch (e) {
      applicationContext.logger.info('Failed to parse PDF');
    }
  } */
  /* eslint-enable spellcheck/spell-checker */

  const documentEntity = new Document(
    {
      ...documentMetadata,
      documentId: primaryDocumentFileId,
      documentType: documentMetadata.documentType,
      filedBy: user.name,
      numberOfPages,
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
