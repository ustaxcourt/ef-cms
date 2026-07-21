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

export const docketClerkReportDocumentQcHelper = (
  get: Get,
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

  const filters = getWorkQueueFilters({
    section: DOCKET_SECTION,
    user: {
      role: selectedClerk.role,
      section: selectedClerk.section,
      userId: selectedClerk.userId,
    },
  });

  const formattedInbox = inboxWorkItems.map(formatReportWorkItem);
  const formattedServed = servedWorkItems.map(formatReportWorkItem);

  const inbox = orderBy(
    formattedInbox.filter(filters.my.inbox),
    'receivedAt',
    'asc',
  );
  const inProgress = orderBy(
    formattedInbox.filter(filters.my.inProgress),
    'receivedAt',
    'asc',
  );
  const processed = orderBy(
    formattedServed.filter(filters.my.outbox),
    'completedAt',
    'desc',
  );

  return { inbox, inProgress, processed };
};
