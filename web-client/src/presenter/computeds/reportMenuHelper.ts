import { state } from 'cerebral';

export const reportMenuHelper = get => {
  const currentPage = get(state.currentPage);
  const permissions = get(state.permissions);

  const isBlockedCasesReport = currentPage.includes('BlockedCasesReport');
  const isCaseDeadlines = currentPage.startsWith('CaseDeadline');

  return {
    pageIsReports: isCaseDeadlines || isBlockedCasesReport,
    showActivityReport: permissions?.JUDGE_ACTIVITY_REPORT,
  };
};
