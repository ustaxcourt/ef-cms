import { Get } from 'cerebral';
import { RecentFiling } from '@shared/business/entities/RecentFiling';
import { sortRecentFilings } from '@shared/business/utilities/sortRecentFilings';
import { state } from '@web-client/presenter/app.cerebral';
import {
  ROLES,
  STIN_DOCKET_ENTRY_TYPE,
  Role,
} from '@shared/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';

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

  if (filing.eventCode === STIN_DOCKET_ENTRY_TYPE.eventCode) {
    if (!filing.isFileAttached) return false;

    const isPetitionsClerk = userRole === ROLES.petitionsClerk;
    const isCaseServicesSupervisor = userRole === ROLES.caseServicesSupervisor;
    const isIrsSuperuser = userRole === ROLES.irsSuperuser;
    const isServed = filing.servedAt;

    if ((isPetitionsClerk || isCaseServicesSupervisor) && !isServed) {
      return true;
    }

    if (isIrsSuperuser && isServed) {
      return true;
    }

    return false;
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

const getDocumentDisplayProperties = (
  filing: RecentFiling,
  userRole: Role | undefined | null,
) => {
  const canAccess = checkDocumentAccess(filing, userRole);
  const isExternalUserRole = isExternalUser(userRole);

  const hasFileAttached = Boolean(filing.isFileAttached);

  return {
    showLinkToDocument: Boolean(canAccess && hasFileAttached),
    showDocumentViewerLink: Boolean(
      canAccess && hasFileAttached && !isExternalUserRole,
    ),
    showDocumentDescriptionWithoutLink: Boolean(!canAccess && hasFileAttached),
    showDocumentProcessing: false,
  };
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
  const recentFilings = get(state.recentFilings);
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
        ...getDocumentDisplayProperties({} as RecentFiling, userRole || null),
      }),
    };
  }

  const validSortFields = [
    'docketNumber',
    'filedDate',
    'document',
    'caseTitle',
  ] as const;
  const sortField = validSortFields.includes(tableSort.sortField)
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

  const recentFilingsWithAccess = sortedRecentFilings.map(filing => ({
    ...filing,
    canAccess: checkDocumentAccess(filing, userRole),
    isSealed: filing.isSealed === true,
    ...getDocumentDisplayProperties(filing, userRole),
  }));

  return {
    sortedRecentFilings: recentFilingsWithAccess,
    sortOptions: generateSortOptions(),
    getDocumentDisplayProperties: (filing: RecentFiling) =>
      getDocumentDisplayProperties(filing, userRole),
  };
};
