import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { NotFoundError } from '@web-api/errors/errors';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { CaseDTO } from '../dto/docketEntries/CaseDTO';

export const removeSignatureFromDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId, docketNumber },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO> => {
  if (!isAuthUser(authorizedUser)) {
    throw new Error(
      'User attempting to remove signature from document is not an auth user',
    );
  }
  const caseRecord = await getCaseByDocketNumber({
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

  docketEntryToUnsign.unsignDocument();

  const originalPdfNoSignature = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: docketEntryToUnsign.documentIdBeforeSignature!,
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: originalPdfNoSignature,
    key: docketEntryToUnsign.documentStorageId,
  });

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new CaseDTO(caseEntity.toRawObject());
};
