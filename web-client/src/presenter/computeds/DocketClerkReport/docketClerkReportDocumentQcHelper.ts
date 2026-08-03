import { Case, isLeadCase } from '@shared/business/entities/cases/Case';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { DOCKET_SECTION } from '@shared/business/entities/EntityConstants';
import {
  FormattedWorkItemWithCaseInfo,
  formatWorkItem,
} from '@web-client/presenter/computeds/formattedWorkQueue';
import { Get } from 'cerebral';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { getWorkQueueFilters } from '@shared/business/utilities/getWorkQueueFilters';
import { orderBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export type DocketClerkReportDocumentQcResults = {
  inbox: FormattedWorkItemWithCaseInfo[];
  inProgress: FormattedWorkItemWithCaseInfo[];
  processed: FormattedWorkItemWithCaseInfo[];
};

const formatReportWorkItem = (
  workItem: RawWorkItemWithCaseAndDocketEntryInfo,
): FormattedWorkItemWithCaseInfo => {
  const formatted = formatWorkItem({ workItem });
  return {
    ...formatted,
    // Read-only drill-in to the document; the report never edits a clerk's work.
    editLink: `/case-detail/${formatted.docketNumber}/document-view?docketEntryId=${formatted.docketEntry.docketEntryId}`,
  };
};

const groupConsolidatedWorkItems = (
  filtered: RawWorkItemWithCaseAndDocketEntryInfo[],
): Array<
  RawWorkItemWithCaseAndDocketEntryInfo & {
    groupedMemberCases?: {
      workItemId: string;
      docketNumber: string;
      inLeadCase: boolean;
    }[];
  }
> => {
  const docketEntryIdGroups = new Map<
    string,
    RawWorkItemWithCaseAndDocketEntryInfo[]
  >();
  const solo: RawWorkItemWithCaseAndDocketEntryInfo[] = [];
  const consolidatedGroups = new Map<
    string,
    RawWorkItemWithCaseAndDocketEntryInfo[]
  >();

  for (const wi of filtered) {
    const key = wi.docketEntryId;
    if (!docketEntryIdGroups.has(key)) docketEntryIdGroups.set(key, []);
    docketEntryIdGroups.get(key)!.push(wi);
  }

  for (const group of docketEntryIdGroups.values()) {
    if (group.length === 1) {
      solo.push(group[0]);
    } else {
      group.forEach(item => {
        // docket entries that were filed on a case that was later removed from a consolidated group
        if (item.docketEntry.multiDocketedOn?.length < 2) {
          solo.push(item);
        } else if (item.leadDocketNumber) {
          const key = item.docketEntryId;
          if (!consolidatedGroups.has(key)) consolidatedGroups.set(key, []);
          consolidatedGroups.get(key)!.push(item);
        } else {
          solo.push(item);
        }
      });
    }
  }

  const consolidatedResult: Array<
    RawWorkItemWithCaseAndDocketEntryInfo & {
      groupedMemberCases?: {
        workItemId: string;
        docketNumber: string;
        inLeadCase: boolean;
      }[];
    }
  > = [];

  for (const group of consolidatedGroups.values()) {
    const leadOrLowestNumber = Case.sortByDocketNumber(group)[0].docketNumber;

    const groupedMemberCases = Case.sortByDocketNumber(
      group
        .filter(item => item.docketNumber !== leadOrLowestNumber)
        .map(item => {
          return {
            workItemId: item.workItemId,
            docketNumber: item.docketNumber,
            inLeadCase: isLeadCase(item),
          };
        }),
    );

    const leadOrLowestNumberedItem = group.find(item => {
      return item.docketNumber === leadOrLowestNumber;
    })!;

    consolidatedResult.push({
      ...leadOrLowestNumberedItem,
      groupedMemberCases,
    });
  }

  return [...solo, ...consolidatedResult];
};

const getHighPriorityOrderFields = (
  STATUS_TYPES: Record<string, string>,
): {
  fields: (string | ((workItemToSort: any) => any))[];
  directions: ('asc' | 'desc')[];
} => {
  const caseStatusSortRank = {
    [STATUS_TYPES.submitted]: 1,
    [STATUS_TYPES.assignedCase]: 2,
    [STATUS_TYPES.assignedMotion]: 3,
    [STATUS_TYPES.jurisdictionRetained]: 4,
  };

  return {
    directions: ['desc', 'asc', 'asc'],
    fields: [
      'highPriority',
      'trialDate',
      workItemToSort => caseStatusSortRank[workItemToSort.caseStatus],
    ],
  };
};

export const docketClerkReportDocumentQcHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): DocketClerkReportDocumentQcResults => {
  const selectedClerk = get(state.docketClerkReport.selectedClerk);
  const inboxWorkItems: RawWorkItemWithCaseAndDocketEntryInfo[] = get(
    state.docketClerkReport.inboxWorkItems,
  );
  const servedWorkItems: RawWorkItemWithCaseAndDocketEntryInfo[] = get(
    state.docketClerkReport.servedWorkItems,
  );

  if (!selectedClerk) {
    return { inbox: [], inProgress: [], processed: [] };
  }

  const { STATUS_TYPES } = applicationContext.getConstants();

  const filters = getWorkQueueFilters({
    section: DOCKET_SECTION,
    user: {
      role: selectedClerk.role,
      section: selectedClerk.section,
      userId: selectedClerk.userId,
    },
  });

  const rawInboxFiltered = inboxWorkItems.filter(filters.my.inbox);
  const rawInProgressFiltered = inboxWorkItems.filter(filters.my.inProgress);
  const rawProcessedFiltered = servedWorkItems.filter(filters.my.outbox);

  const groupedInbox = groupConsolidatedWorkItems(rawInboxFiltered);
  const groupedProcessed = groupConsolidatedWorkItems(rawProcessedFiltered);

  const highPriorityOrder = getHighPriorityOrderFields(STATUS_TYPES);

  const inbox = orderBy(
    groupedInbox.map(formatReportWorkItem),
    [...highPriorityOrder.fields, 'receivedAt', 'docketNumber'],
    [...highPriorityOrder.directions, 'asc', 'asc'],
  );
  const inProgress = orderBy(
    rawInProgressFiltered.map(formatReportWorkItem),
    'receivedAt',
    'asc',
  );
  const processed = orderBy(
    groupedProcessed.map(formatReportWorkItem),
    'completedAt',
    'desc',
  );

  return { inbox, inProgress, processed };
};
