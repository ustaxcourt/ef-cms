import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

export const unsealDocketEntryInteractor = async (
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawDocketEntry> => {
  const hasPermission = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY,
  );

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketEntry = (
    await getDocketEntriesByDocketNumberAndDocketEntryId({
      docketNumbersAndIds: [{ docketEntryId, docketNumber }],
    })
  )[0];

  if (!docketEntry) {
    throw new NotFoundError('Docket entry not found');
  }

  const workItem = await getWorkItemByDocketNumberAndDocketEntryId({
    docketEntryId,
    docketNumber,
  });

  const docketEntryEntity = new DocketEntry(
    {
      ...docketEntry,
      qcComplete: !!workItem?.completedAt,
      qcViewed: !!workItem?.isRead,
      workItemId: workItem?.workItemId,
    },
    { authorizedUser },
  );

  docketEntryEntity.unsealEntry();

  const validatedDocketEntry = docketEntryEntity.validate().toRawObject();

  await upsertDocketEntries([validatedDocketEntry]);

  return validatedDocketEntry;
};
