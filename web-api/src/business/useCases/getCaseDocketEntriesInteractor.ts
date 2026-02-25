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
  AuthUser,
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
  archivedDocketEntries?: RawDocketEntry[];
  totalCount: number;
  hasPendingItems: boolean;
}> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket entries for: ${docketNumber}`,
    );
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);
  // Preserve the AuthUser reference before isAuthorized (a type guard) narrows it
  const user: AuthUser = authorizedUser;
  const hasFullAccess = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.GET_ALL_CASE_DATA,
  );
  const filterOnDocketRecord = !hasFullAccess;

  // For non-privileged users, determine their association level with the case.
  // On staging, CaseFactory distinguished between:
  //   - Associated users → CaseDTO (all on-record entries, internal fields stripped)
  //   - IRS superuser with served petition → CaseDTO (same as associated)
  //   - Unassociated users on sealed cases → RestrictedCaseDTO (empty docket entries)
  //   - Unassociated users on unsealed cases → PublicCaseDTO (restricted field allowlist)
  let isAssociatedOrPrivileged = false;
  if (!hasFullAccess) {
    const isCaseSealed = await checkIfCaseIsSealed(formattedDocketNumber);

    if (user.role === ROLES.irsSuperuser) {
      // IRS superuser with served petition gets associated-level access
      const petitionServed =
        await computePetitionServedStatus(formattedDocketNumber);
      isAssociatedOrPrivileged = petitionServed;
      // If case is sealed and IRS superuser doesn't have served petition, deny
      if (isCaseSealed && !isAssociatedOrPrivileged) {
        return EMPTY_RESULT;
      }
    } else {
      const isAssociated = await verifyCaseForUser({
        docketNumber: formattedDocketNumber,
        userId: user.userId,
      });
      isAssociatedOrPrivileged = isAssociated;

      if (isCaseSealed && !isAssociated) {
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
    user.role === ROLES.irsSuperuser &&
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
    user,
  );

  let processedDocketEntries: RawDocketEntry[];
  if (hasFullAccess) {
    processedDocketEntries = filteredDocketEntries;
  } else if (isAssociatedOrPrivileged) {
    // Associated users get all on-record entries with internal fields stripped
    processedDocketEntries = filteredDocketEntries.map(
      stripInternalDocketEntryFields,
    );
  } else {
    // Unassociated users get PublicDocketEntry-style restricted field set
    processedDocketEntries = filteredDocketEntries.map(
      toPublicDocketEntryFields,
    );
  }

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

// Allowlist of fields that unassociated (public) users may see on docket entries.
// This mirrors the fields exposed by the PublicDocketEntry entity on staging.
const PUBLIC_DOCKET_ENTRY_ALLOWED_FIELDS: ReadonlySet<string> = new Set([
  'action',
  'additionalInfo',
  'additionalInfo2',
  'affectedByDocketEntries',
  'affectedDocketEntries',
  'attachments',
  'certificateOfService',
  'certificateOfServiceDate',
  'docketEntryId',
  'docketNumber',
  'documentTitle',
  'documentType',
  'eventCode',
  'filedBy',
  'filedByRole',
  'filingDate',
  'freeText',
  'index',
  'isFileAttached',
  'isLegacyServed',
  'isOnDocketRecord',
  'isPaper',
  'isSealed',
  'isStricken',
  'lodged',
  'numberOfPages',
  'objections',
  'processingStatus',
  'receivedAt',
  'sealedTo',
  'servedAt',
  'servedPartiesCode',
]);

/**
 * Restricts a docket entry to only the fields visible to unassociated / public
 * users.  Mirrors the PublicDocketEntry entity from staging.
 */
export function toPublicDocketEntryFields(
  docketEntry: RawDocketEntry,
): RawDocketEntry {
  const publicEntry: Record<string, any> = {};
  for (const key of Object.keys(docketEntry)) {
    if (PUBLIC_DOCKET_ENTRY_ALLOWED_FIELDS.has(key)) {
      publicEntry[key] = docketEntry[key];
    }
  }
  // previousDocument gets a restricted subset of fields
  if (docketEntry.previousDocument) {
    publicEntry.previousDocument = {
      docketEntryId: docketEntry.previousDocument.docketEntryId,
      documentTitle: docketEntry.previousDocument.documentTitle,
      documentType: docketEntry.previousDocument.documentType,
    };
  }
  return publicEntry as RawDocketEntry;
}

// These fields are only assigned in DocketEntry.initForUnfilteredForInternalUsers
// and must be stripped for non-internal users to match the filtered DocketEntry behavior.
export const INTERNAL_ONLY_DOCKET_ENTRY_FIELDS = [
  'draftOrderState',
  'editState',
  'isDraft',
  'judge',
  'pending',
  'previousDocument',
  'qcComplete',
  'qcViewed',
  'signedAt',
  'signedByUserId',
  'signedJudgeName',
  'stampData',
  'strickenBy',
  'strickenByUserId',
  'userId',
  'workItem',
  'workItemId',
] as const;

export function stripInternalDocketEntryFields(
  docketEntry: RawDocketEntry,
): RawDocketEntry {
  const stripped = { ...docketEntry };
  for (const field of INTERNAL_ONLY_DOCKET_ENTRY_FIELDS) {
    delete stripped[field];
  }
  return stripped;
}
