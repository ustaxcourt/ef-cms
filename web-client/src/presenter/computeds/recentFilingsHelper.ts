import { Get } from 'cerebral';
import { RecentFiling } from '@shared/business/entities/RecentFiling';
import { sortRecentFilings } from '@shared/business/utilities/sortRecentFilings';
import { state } from '@web-client/presenter/app.cerebral';
import {
  ROLES,
  STIN_DOCKET_ENTRY_TYPE,
  DOCKET_ENTRY_SEALED_TO_TYPES,
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

  if (filing.caseIsSealed) {
    if (User.isInternalUser(userRole)) {
      return Boolean(filing.isFileAttached);
    }
    return Boolean(filing.isFileAttached);
  }

  if (filing.isSealed && filing.sealedTo) {
    if (filing.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL) {
      return User.isInternalUser(userRole);
    }
    if (filing.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC) {
      return Boolean(filing.isFileAttached);
    }
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

  const isServed = filing.servedAt;

  const unservableEventCodes = [
    'TCRP',
    'SPOS',
    'SPTO',
    'SPTN',
    'NTD',
    'NORP',
    'NOIP',
    'NCTL',
    'NODC',
  ];
  const isUnservable =
    filing.eventCode && unservableEventCodes.includes(filing.eventCode);

  if (!isServed && !isUnservable) {
    const allowedEventCodes = [
      'P',
      'ATP',
      'DISC',
      'NOT',
      'NOTR',
      'NTD',
      'SPOS',
      'SPTO',
      'TCRP',
      'NORP',
      'NOIP',
      'NCTL',
      'NODC',
    ];

    if (!filing.eventCode || !allowedEventCodes.includes(filing.eventCode)) {
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

      return {
        ...filing,
        canAccess,
        isSealed: filing.isSealed === true,
        showLinkToDocument: Boolean(canAccess && hasFileAttached),
        showDocumentViewerLink: Boolean(
          canAccess && hasFileAttached && !isExternalUserRole,
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

      return {
        showLinkToDocument: Boolean(canAccess && hasFileAttached),
        showDocumentViewerLink: Boolean(
          canAccess && hasFileAttached && !isExternalUserRole,
        ),
        showDocumentDescriptionWithoutLink: Boolean(
          !canAccess && hasFileAttached,
        ),
        showDocumentProcessing: false,
      };
    },
  };
};
