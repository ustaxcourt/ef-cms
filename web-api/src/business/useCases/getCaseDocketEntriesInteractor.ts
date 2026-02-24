import {
  DOCKET_ENTRIES_PAGE_SIZE,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
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
import { docketEntriesBaseQuery } from '@web-api/persistence/postgres/docketEntries/commonQueries';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { getDocketEntriesPaginated } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesPaginated';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import {
  Case,
  filterStinFromDocketEntries,
} from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';
import { removeServedParties } from '@shared/business/dto/helpers/removeServedParties';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';

const EMPTY_RESULT = {
  archivedDocketEntries: [] as RawDocketEntry[],
  docketEntries: [] as RawDocketEntry[],
  hasPendingItems: false,
  totalCount: 0,
};

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
  const hasFullAccess = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.GET_ALL_CASE_DATA,
  );
  const filterOnDocketRecord = !hasFullAccess;

  if (!hasFullAccess) {
    const isCaseSealed = await checkIfCaseIsSealed(formattedDocketNumber);
    if (isCaseSealed) {
      const isAssociated = await verifyCaseForUser({
        docketNumber: formattedDocketNumber,
        userId: authorizedUser.userId,
      });
      if (!isAssociated) {
        return EMPTY_RESULT;
      }
    }
  }

  const [paginatedResult, workItems, hasPendingItems] = await Promise.all([
    getDocketEntriesPaginated({
      docketNumber: formattedDocketNumber,
      filterOnDocketRecord,
      includeArchived: hasFullAccess,
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

  // IRS Super Users should see the STIN when the petition has been served,
  // even though it's not on the docket record. Since filterOnDocketRecord
  // excludes it from the paginated query, fetch it separately.
  if (
    authorizedUser.role === ROLES.irsSuperuser &&
    filterOnDocketRecord &&
    page === 0
  ) {
    const petitionIsServed = await computePetitionServedStatus(
      formattedDocketNumber,
    );
    if (petitionIsServed) {
      const stinEntry = await fetchStinEntry(formattedDocketNumber);
      if (stinEntry) {
        paginatedResult.docketEntries.unshift(stinEntry);
      }
    }
  }

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

  const filteredDocketEntries = filterStinFromDocketEntries(
    enrichedDocketEntries,
    authorizedUser,
  );

  const processedDocketEntries = hasFullAccess
    ? filteredDocketEntries
    : filteredDocketEntries.map(stripInternalDocketEntryFields);

  const result: {
    docketEntries: RawDocketEntry[];
    archivedDocketEntries?: RawDocketEntry[];
    hasPendingItems: boolean;
    totalCount: number;
  } = {
    docketEntries: removeServedParties(processedDocketEntries),
    hasPendingItems,
    totalCount: paginatedResult.totalCount,
  };

  if (hasFullAccess) {
    const enrichedArchivedEntries = paginatedResult.archivedDocketEntries.map(
      docketEntry => {
        const workItem = workItemByDocketEntryId.get(
          docketEntry.docketEntryId,
        );
        return {
          ...docketEntry,
          qcComplete: !!workItem?.completedAt,
          qcViewed: !!workItem?.isRead,
          workItemId: workItem?.workItemId,
        };
      },
    );
    result.archivedDocketEntries = removeServedParties(enrichedArchivedEntries);
  }

  return result;
};

async function checkIfCaseIsSealed(
  docketNumber: string,
): Promise<boolean> {
  const caseRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', '=', docketNumber)
      .select(['sealedDate', 'isSealed'])
      .executeTakeFirst(),
  );
  return !!caseRecord?.isSealed || !!caseRecord?.sealedDate;
}

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

async function computePetitionServedStatus(
  docketNumber: string,
): Promise<boolean> {
  const petitionEntry = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', '=', docketNumber)
      .where('documentType', '=', 'Petition')
      .select(['servedAt'])
      .executeTakeFirst(),
  );
  return !!petitionEntry?.servedAt;
}

async function fetchStinEntry(
  docketNumber: string,
): Promise<RawDocketEntry | undefined> {
  const baseQuery = await docketEntriesBaseQuery({
    docketNumbers: [docketNumber],
  });
  const result = await baseQuery
    .where(
      'de.documentType',
      '=',
      INITIAL_DOCUMENT_TYPES.stin.documentType,
    )
    .where('de.archived', 'is not', true)
    .executeTakeFirst();
  return result ? fromKyselyDocketEntry(result) : undefined;
}

// These fields are only assigned in DocketEntry.initForUnfilteredForInternalUsers
// and must be stripped for non-internal users to match the filtered DocketEntry behavior.
const INTERNAL_ONLY_DOCKET_ENTRY_FIELDS = [
  'draftOrderState',
  'editState',
  'isDraft',
  'judge',
  'pending',
  'previousDocument',
  'signedAt',
  'signedByUserId',
  'signedJudgeName',
  'stampData',
  'strickenBy',
  'strickenByUserId',
  'userId',
  'workItem',
] as const;

function stripInternalDocketEntryFields(
  docketEntry: RawDocketEntry,
): RawDocketEntry {
  const stripped = { ...docketEntry };
  for (const field of INTERNAL_ONLY_DOCKET_ENTRY_FIELDS) {
    delete stripped[field];
  }
  return stripped;
}
