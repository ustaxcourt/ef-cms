import {
  DOCKET_CLERK_REPORT_PAGE_TYPES,
  DOCKET_CLERK_REPORT_PAGE_TYPE_OPTIONS,
  DocketClerkReportPageType,
} from './docketClerkReportConstants';
import { Get } from 'cerebral';
import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export type DocketClerkReportHelperResults = {
  docketClerkOptions: { name: string; userId: string }[];
  errors: { docketClerkUserId?: string; pageType?: string } | null;
  pageTypeOptions: { key: DocketClerkReportPageType; label: string }[];
  reportTitle: string;
  showDocumentQc: boolean;
  showMessages: boolean;
  showResults: boolean;
};

export const docketClerkReportHelper = (
  get: Get,
): DocketClerkReportHelperResults => {
  const docketClerks: RawUser[] = get(state.docketClerkReport.docketClerks);
  const selectedClerk = get(state.docketClerkReport.selectedClerk);
  const pageType = get(state.docketClerkReport.pageType);
  const errors = get(state.docketClerkReport.errors);

  const docketClerkOptions = docketClerks.map(clerk => ({
    name: clerk.name,
    userId: clerk.userId,
  }));

  const showResults = !!selectedClerk && !!pageType;
  const showDocumentQc =
    showResults && pageType === DOCKET_CLERK_REPORT_PAGE_TYPES.documentQC;
  const showMessages =
    showResults && pageType === DOCKET_CLERK_REPORT_PAGE_TYPES.messages;

  let reportTitle = '';
  if (showResults) {
    const pageTypeLabel = showMessages ? 'Messages' : 'Document QC';
    reportTitle = `${selectedClerk.name}'s ${pageTypeLabel}`;
  }

  return {
    docketClerkOptions,
    errors: errors || null,
    pageTypeOptions: DOCKET_CLERK_REPORT_PAGE_TYPE_OPTIONS,
    reportTitle,
    showDocumentQc,
    showMessages,
    showResults,
  };
};
