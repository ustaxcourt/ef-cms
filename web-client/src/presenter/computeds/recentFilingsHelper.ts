import { Get } from 'cerebral';
import { RecentFiling } from '@shared/business/entities/RecentFiling';
import { sortRecentFilings } from '@shared/business/utilities/sortRecentFilings';
import { state } from '@web-client/presenter/app.cerebral';
import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  Role,
  ALLOWED_EVENT_CODES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';

const checkSealedDocumentAccess = (
  filing: RecentFiling,
  userRole: Role | undefined | null,
) => {
  if (filing.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL) {
    return User.isInternalUser(userRole || undefined);
  }
  if (filing.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC) {
    return Boolean(filing.isFileAttached);
  }
  return false;
};

const checkDocumentAccess = (
  filing: RecentFiling,
  userRole: Role | undefined | null,
) => {
  if (!userRole) {
    return false;
  }

  if (filing.isStricken) {
    return false;
  }

  if (filing.isSealed && filing.sealedTo) {
    return checkSealedDocumentAccess(filing, userRole);
  }

  const isServed = filing.servedAt;
  const isUnservable =
    filing.eventCode && UNSERVABLE_EVENT_CODES.includes(filing.eventCode);

  if (!isServed && !isUnservable) {
    if (!filing.eventCode || !ALLOWED_EVENT_CODES.includes(filing.eventCode)) {
      return false;
    }
  }

  return Boolean(filing.isFileAttached);
};

/**
 * Determines if a user role represents an external user
 * @param userRole - The user's role
 * @returns true if the user is external, false otherwise
 */
const isExternalUser = (userRole: Role | undefined | null): boolean => {
  if (!userRole) {
    return false;
  }
  return User.isExternalUser(userRole);
};

const SORT_FIELDS = [
  { field: 'docketNumber', label: 'Docket Number' },
  { field: 'filedDate', label: 'Filed Date' },
  { field: 'document', label: 'Document' },
  { field: 'caseTitle', label: 'Case Title' },
] as const;

const generateSortOptions = () => {
  return SORT_FIELDS.flatMap(({ field, label }) => [
    {
      value: `${field}-asc`,
      label: `${label} (Ascending)`,
      field,
      order: 'asc' as const,
    },
    {
      value: `${field}-desc`,
      label: `${label} (Descending)`,
      field,
      order: 'desc' as const,
    },
  ]);
};

export const recentFilingsHelper = (get: Get) => {
  const recentFilings = get(state.recentFilings) as RecentFiling[];
  const userRole = get(state.user.role);
  const tableSort = get(state.recentFilingsTableSort) || {
    sortField: 'filedDate',
    sortOrder: 'desc',
  };

  if (!recentFilings || !Array.isArray(recentFilings)) {
    return {
      sortedRecentFilings: [],
      sortOptions: generateSortOptions(),
      getDocumentDisplayProperties: () => ({
        showLinkToDocument: false,
        showDocumentViewerLink: false,
        showDocumentDescriptionWithoutLink: false,
        showDocumentProcessing: false,
      }),
    };
  }

  const validSortFields = [
    'docketNumber',
    'filedDate',
    'document',
    'caseTitle',
  ] as const;
  const sortField = validSortFields.includes(tableSort.sortField as any)
    ? (tableSort.sortField as (typeof validSortFields)[number])
    : 'filedDate';
  const sortOrder = ['asc', 'desc'].includes(tableSort.sortOrder)
    ? (tableSort.sortOrder as 'asc' | 'desc')
    : 'desc';

  const sortedRecentFilings = sortRecentFilings(
    recentFilings,
    sortField,
    sortOrder,
  );

  const recentFilingsWithAccess = sortedRecentFilings.map(
    (filing: RecentFiling) => {
      const canAccess = checkDocumentAccess(filing, userRole);
      const isExternalUserRole = isExternalUser(userRole);
      const hasFileAttached = Boolean(filing.isFileAttached);
      const isUserAssociated = filing.isRequestingUserAssociated !== false;

      return {
        ...filing,
        canAccess,
        isSealed: filing.isSealed === true,
        showLinkToDocument: Boolean(canAccess && hasFileAttached && isUserAssociated),
        showDocumentViewerLink: Boolean(
          canAccess && hasFileAttached && !isExternalUserRole && isUserAssociated,
        ),
        showDocumentDescriptionWithoutLink: Boolean(
          !canAccess && hasFileAttached,
        ),
        showDocumentProcessing: false,
      };
    },
  );

  return {
    sortedRecentFilings: recentFilingsWithAccess,
    sortOptions: generateSortOptions(),
    getDocumentDisplayProperties: (filing: RecentFiling) => {
      const canAccess = checkDocumentAccess(filing, userRole);
      const isExternalUserRole = isExternalUser(userRole);
      const hasFileAttached = Boolean(filing.isFileAttached);
      const isUserAssociated = filing.isRequestingUserAssociated !== false;

      return {
        showLinkToDocument: Boolean(canAccess && hasFileAttached && isUserAssociated),
        showDocumentViewerLink: Boolean(
          canAccess && hasFileAttached && !isExternalUserRole && isUserAssociated,
        ),
        showDocumentDescriptionWithoutLink: Boolean(
          !canAccess && hasFileAttached,
        ),
        showDocumentProcessing: false,
      };
    },
  };
};
