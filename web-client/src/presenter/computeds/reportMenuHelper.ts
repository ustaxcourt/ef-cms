import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const reportMenuHelper = (get: Get): any => {
  const currentPage = get(state.currentPage);
  const permissions = get(state.permissions);

  const isBlockedCasesReport = currentPage.includes('BlockedCasesReport');
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');
  const isDocketClerkReport = currentPage.startsWith('DocketClerkReport');

  return {
    pageIsReports:
      isCaseDeadlines || isBlockedCasesReport || isDocketClerkReport,
    showActivityReport: permissions?.JUDGE_ACTIVITY_REPORT,
    showDocketClerkReport: permissions?.DOCKET_CLERK_REPORT,
  };
};
