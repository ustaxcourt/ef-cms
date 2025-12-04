import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';

export const sealDocketEntryInteractor = async (
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
): Promise<RawDocketEntry> => {
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

  const docketEntry = (
    await getDocketEntriesByDocketNumberAndDocketEntryId({
      docketNumbersAndIds: [{ docketEntryId, docketNumber }],
    })
  )[0];

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

  if (!docketEntry) {
    throw new NotFoundError('Docket entry not found');
  }

  docketEntryEntity.sealEntry({ sealedTo: docketEntrySealedTo });

  const validatedDocketEntry = docketEntryEntity.validate().toRawObject();

  await upsertDocketEntries([validatedDocketEntry]);

  return validatedDocketEntry;
};
