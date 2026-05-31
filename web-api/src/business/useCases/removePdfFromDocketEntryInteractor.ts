import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export const removePdfFromDocketEntry = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId, docketNumber },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseRecord, {
    authorizedUser,
  });

  const docketEntry = caseEntity.getDocketEntryById({ docketEntryId });

  if (docketEntry && docketEntry.isFileAttached) {
    await applicationContext.getPersistenceGateway().deleteDocumentFile({
      applicationContext,
      key: docketEntry.documentStorageId,
    });

    docketEntry.isFileAttached = false;
    caseEntity.updateDocketEntry(docketEntry);

    await updateCaseAndAssociations({
      authorizedUser,
      caseToUpdate: caseEntity,
    });
  }
};

export const removePdfFromDocketEntryInteractor = withLocking(
  removePdfFromDocketEntry,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
