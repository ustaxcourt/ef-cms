import {
  DOCKET_ENTRIES_PAGE_SIZE,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getDocketEntriesPaginated } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesPaginated';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { Case } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';
import { removeServedParties } from '@shared/business/dto/helpers/removeServedParties';

export const getCaseDocketEntriesInteractor = async (
  {
    docketNumber,
    page = 0,
    pageSize = DOCKET_ENTRIES_PAGE_SIZE,
  }: {
    docketNumber: string;
    page?: number;
    pageSize?: number;
  },
  authorizedUser: UnknownAuthUser,
): Promise<{
  docketEntries: RawDocketEntry[];
  archivedDocketEntries: RawDocketEntry[];
  totalCount: number;
  hasPendingItems: boolean;
}> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket entries for: ${docketNumber}`,
    );
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);
  const filterOnDocketRecord = !isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.GET_ALL_CASE_DATA,
  );

  const [paginatedResult, workItems, hasPendingItems] = await Promise.all([
    getDocketEntriesPaginated({
      docketNumber: formattedDocketNumber,
      filterOnDocketRecord,
      page,
      pageSize,
    }),
    getWorkItemsByDocketNumber({
      docketNumber: formattedDocketNumber,
    }),
    computeHasPendingItems(formattedDocketNumber),
  ]);

  const workItemByDocketEntryId = new Map(
    workItems.map(wi => [wi.docketEntryId, wi]),
  );

  const enrichedDocketEntries = paginatedResult.docketEntries.map(
    docketEntry => {
      const workItem = workItemByDocketEntryId.get(docketEntry.docketEntryId);
      return {
        ...docketEntry,
        qcComplete: !!workItem?.completedAt,
        qcViewed: !!workItem?.isRead,
        workItemId: workItem?.workItemId,
      };
    },
  );

  const enrichedArchivedEntries = paginatedResult.archivedDocketEntries.map(
    docketEntry => {
      const workItem = workItemByDocketEntryId.get(docketEntry.docketEntryId);
      return {
        ...docketEntry,
        qcComplete: !!workItem?.completedAt,
        qcViewed: !!workItem?.isRead,
        workItemId: workItem?.workItemId,
      };
    },
  );

  return {
    archivedDocketEntries: removeServedParties(enrichedArchivedEntries),
    docketEntries: removeServedParties(enrichedDocketEntries),
    hasPendingItems,
    totalCount: paginatedResult.totalCount,
  };
};

async function computeHasPendingItems(
  docketNumber: string,
): Promise<boolean> {
  const pendingEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', '=', docketNumber)
      .where('pending', '=', true)
      .select(['servedAt', 'eventCode'])
      .execute(),
  );

  return pendingEntries.some(
    entry =>
      entry.servedAt !== null ||
      UNSERVABLE_EVENT_CODES.includes(entry.eventCode),
  );
}
