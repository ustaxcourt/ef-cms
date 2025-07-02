import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { NotFoundError } from '@web-api/errors/errors';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

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
  applicationContext: ServerApplicationContext,
  { docketEntryId, docketNumber },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthUser(authorizedUser)) {
    throw new Error(
      'User attempting to remove signature from document is not an auth user',
    );
  }
  const caseRecord = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });
  const docketEntryToUnsign = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryToUnsign) {
    throw new NotFoundError(
      `Could not find docket entry with id ${docketEntryId} on case ${docketNumber}`,
    );
  }

  const docketEntryToUnsignEntity = new DocketEntry(docketEntryToUnsign, {
    authorizedUser,
  });

  docketEntryToUnsignEntity.unsignDocument();

  const originalPdfNoSignature = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      // @ts-ignore
      key: docketEntryToUnsignEntity.documentIdBeforeSignature,
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: originalPdfNoSignature,
    key: docketEntryId,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return caseEntity.toRawObject();
};
