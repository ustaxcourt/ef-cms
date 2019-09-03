const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');

/**
 * saveSignedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case on which to save the document
 * @param {string} providers.originalDocumentId the id of the original (unsigned) document
 * @param {string} providers.signedDocumentId the id of the signed document
 * @returns {object} the updated case
 */
exports.saveSignedDocumentInteractor = async ({
  applicationContext,
  caseId,
  originalDocumentId,
  signedDocumentId,
}) => {
  const user = applicationContext.getCurrentUser();

  applicationContext.logger.time('Fetching the Case');
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });
  applicationContext.logger.timeEnd('Fetching the Case');

  const originalDocumentEntity = caseEntity.documents.find(
    document => document.documentId === originalDocumentId,
  );

  const signedDocumentEntity = new Document(
    {
      createdAt: applicationContext.getUtilities().createISODateString(),
      documentId: signedDocumentId,
      documentType:
        Document.SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
      eventCode:
        Document.SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
      filedBy: originalDocumentEntity.filedBy,
      isPaper: false,
      processingStatus: 'complete',
      userId: user.userId,
    },
    { applicationContext },
  );

  signedDocumentEntity.setSigned(user.userId);

  caseEntity.addDocumentWithoutDocketRecord(signedDocumentEntity);

  applicationContext.logger.time('Updating case with signed document');

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  applicationContext.logger.timeEnd('Updating case with signed document');

  return caseEntity;
};
