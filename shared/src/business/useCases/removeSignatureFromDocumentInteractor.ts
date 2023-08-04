import { Case } from '../entities/cases/Case';

/**
 * Removes a signature from a document
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to remove the signature from the document
 * @param {string} providers.docketEntryId the id of the docket entry for the signed document
 * @returns {object} the updated case
 */
export const removeSignatureFromDocumentInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
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
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalPdfNoSignature,
    key: docketEntryId,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  return caseEntity.toRawObject();
};
