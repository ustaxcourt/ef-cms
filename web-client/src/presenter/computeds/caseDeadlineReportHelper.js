import { state } from 'cerebral';

export const caseDeadlineReportHelper = (get, applicationContext) => {
  let caseDeadlines = get(state.allCaseDeadlines) || [];
  let filterDate = get(state.filterDate);

  filterDate = applicationContext
    .getUtilities()
    .prepareDateFromString(filterDate);

  filterDate = applicationContext
    .getUtilities()
    .formatDateString(filterDate, 'MMMM D, YYYY');

  caseDeadlines = caseDeadlines.map(d => ({
    ...d,
    formattedDeadline: applicationContext
      .getUtilities()
      .formatDateString(d.deadlineDate, 'MMDDYY'),
    formattedDocketNumber: `${d.docketNumber}${d.docketNumberSuffix || ''}`,
  }));

  return {
    caseDeadlineCount: caseDeadlines.length,
    caseDeadlines,
    formattedFilterDate: filterDate,
  };
};
