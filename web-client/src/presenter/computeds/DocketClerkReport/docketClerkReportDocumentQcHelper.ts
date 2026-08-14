import { ClientApplicationContext } from '@web-client/applicationContext';
import { DOCKET_SECTION } from '@shared/business/entities/EntityConstants';
import {
  FormattedWorkItemWithCaseInfo,
  formatWorkItem,
  getHighPriorityOrderFields,
  groupConsolidatedWorkItems,
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
