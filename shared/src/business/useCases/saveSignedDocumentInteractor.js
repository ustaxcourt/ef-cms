const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');

/**
 * saveSignedDocumentInteractor
 *
 * @param caseId
 * @param document signed document
 * @param documentId
 * @param applicationContext
 * @returns {*}
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

  const caseEntity = new Case(caseRecord);
  applicationContext.logger.timeEnd('Fetching the Case');

  const originalDocumentEntity = caseEntity.documents.find(
    document => document.documentId === originalDocumentId,
  );

  const signedDocumentEntity = new Document({
    createdAt: applicationContext.getUtilities().createISODateString(),
    documentId: signedDocumentId,
    documentType: originalDocumentEntity.documentType,
    filedBy: originalDocumentEntity.filedBy,
    isPaper: originalDocumentEntity.isPaper,
    userId: user.userId,
  });

  caseEntity.addDocument(signedDocumentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity;
};
