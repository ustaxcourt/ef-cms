const { Case } = require('../entities/cases/Case');

/**
 * Removes a signature from a document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case on which to remove the signature from the document
 * @param {string} providers.documentId the id of the signed document
 * @returns {object} the updated case
 */
exports.removeSignatureFromDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });
  const documentToUnsign = caseEntity.getDocumentById({ documentId });

  documentToUnsign.unsignDocument();

  const originalPdfNoSignature = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: documentToUnsign.documentIdBeforeSignature,
      protocol: 'S3',
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalPdfNoSignature,
    documentId,
  });

  const caseToUpdate = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate,
  });

  return caseToUpdate;
};
