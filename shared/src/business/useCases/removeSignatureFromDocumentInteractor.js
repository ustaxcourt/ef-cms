const { Case } = require('../entities/cases/Case');

/**
 * fixme
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case on which to save the document
 * @param {string} providers.originalDocumentId the id of the original (unsigned) document
 * @param {string} providers.signedDocumentId the id of the signed document
 * @param {string} providers.nameForSigning the name on the signature of the signed document
 * @returns {object} the updated case
 */
exports.removeSignatureFromDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  // get case entity
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  // get document from the case
  const documentToUnsign = caseEntity.getDocumentById({ documentId });
  documentToUnsign.unsignDocument();

  // get pdf from s3
  const originalPdfNoSignature = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: documentToUnsign.documentIdBeforeSignature,
      protocol: 'S3',
      useTempBucket: false,
    });

  // overwrite signed pdf in s3 with pdf without signature
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalPdfNoSignature,
    documentId,
  });

  // update case
  const caseToUpdate = caseEntity.validate().toRawObject();
  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate,
  });

  // return case entity
  return caseToUpdate;
};
