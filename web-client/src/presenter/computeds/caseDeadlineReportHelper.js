import { state } from 'cerebral';

export const caseDeadlineReportHelper = (get, applicationContext) => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let caseDeadlines = get(state.caseDeadlineReport.caseDeadlines) || [];
  const totalCount = get(state.caseDeadlineReport.totalCount) || 0;
  const judgeFilter = get(state.caseDeadlineReport.judgeFilter);
  const showLoadMoreButton = caseDeadlines.length < totalCount;

  const showJudgeSelect = caseDeadlines.length > 0 || judgeFilter;
  const showNoDeadlines = caseDeadlines.length === 0;

  let filterStartDate = get(state.screenMetadata.filterStartDate);
  let filterEndDate = get(state.screenMetadata.filterEndDate);
  const judges = (get(state.judges) || [])
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  filterStartDate = applicationContext
    .getUtilities()
    .prepareDateFromString(filterStartDate);

  let formattedFilterDateHeader = applicationContext
    .getUtilities()
    .formatDateString(filterStartDate, 'MMMM D, YYYY');

  if (filterEndDate && !filterStartDate.isSame(filterEndDate, 'day')) {
    filterEndDate = applicationContext
      .getUtilities()
      .prepareDateFromString(filterEndDate);

    formattedFilterDateHeader +=
      ' – ' +
      applicationContext
        .getUtilities()
        .formatDateString(filterEndDate, 'MMMM D, YYYY');
  }

  caseDeadlines = caseDeadlines.map(d => ({
    ...d,
    associatedJudgeFormatted: applicationContext
      .getUtilities()
      .getJudgeLastName(d.associatedJudge),
    caseTitle: applicationContext.getCaseTitle(d.caseCaption || ''),
    formattedDeadline: applicationContext
      .getUtilities()
      .formatDateString(d.deadlineDate, 'MMDDYY'),
  }));

  return {
    caseDeadlines,
    formattedFilterDateHeader,
    judges,
    showJudgeSelect,
    showLoadMoreButton,
    showNoDeadlines,
    totalCount,
  };
};
