import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

export const sealDocketEntryInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketEntrySealedTo,
    docketNumber,
  }: {
    docketEntryId: string;
    docketEntrySealedTo: string;
    docketNumber: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!docketEntrySealedTo) {
    throw new Error('Docket entry sealed to is required');
  }

  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError('Docket entry not found');
  }

  docketEntryEntity.sealEntry({ sealedTo: docketEntrySealedTo });

  const validatedDocketEntry = docketEntryEntity.validate().toRawObject();

  await upsertDocketEntries([validatedDocketEntry]);

  return validatedDocketEntry;
};
