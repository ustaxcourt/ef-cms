const { Case } = require('../entities/cases/Case');

/**
 * Removes a signature from a document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which to remove the signature from the document
 * @param {string} providers.docketEntryId the id of the docket entry for the signed document
 * @returns {object} the updated case
 */
exports.removeSignatureFromDocumentInteractor = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });
  const docketEntryToUnsign = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  docketEntryToUnsign.unsignDocument();

  const originalPdfNoSignature = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: docketEntryToUnsign.documentIdBeforeSignature,
      protocol: 'S3',
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalPdfNoSignature,
    key: docketEntryId,
  });

  const caseToUpdate = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate,
  });

  return caseToUpdate;
};
