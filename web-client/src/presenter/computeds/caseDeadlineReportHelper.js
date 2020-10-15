import { state } from 'cerebral';

export const sortByDateAndDocketNumber = applicationContext => (a, b) => {
  const firstDate = a.deadlineDate;
  const secondDate = b.deadlineDate;

  if (firstDate === secondDate) {
    return applicationContext.getUtilities().compareCasesByDocketNumber(a, b);
  } else {
    return firstDate.localeCompare(secondDate, 'en');
  }
};

export const caseDeadlineReportHelper = (get, applicationContext) => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  let caseDeadlines = get(state.caseDeadlineReport.caseDeadlines) || [];
  const totalCount = get(state.caseDeadlineReport.totalCount) || 0;
  const showLoadMoreButton = caseDeadlines.length < totalCount;
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

  const judgeFilter = get(state.screenMetadata.caseDeadlinesFilter.judge);

  caseDeadlines = caseDeadlines
    .sort(sortByDateAndDocketNumber(applicationContext)) // TODO 6683 move this sorting into ES call
    .map(d => ({
      ...d,
      associatedJudgeFormatted: applicationContext
        .getUtilities()
        .formatJudgeName(d.associatedJudge),
      caseTitle: applicationContext.getCaseTitle(d.caseCaption || ''),
      formattedDeadline: applicationContext
        .getUtilities()
        .formatDateString(d.deadlineDate, 'MMDDYY'),
    }));

  if (judgeFilter) {
    // TODO 6683 move this filtering into ES call
    caseDeadlines = caseDeadlines.filter(
      i => i.associatedJudgeFormatted === judgeFilter,
    );
  }

  return {
    caseDeadlines,
    formattedFilterDateHeader,
    judges,
    showLoadMoreButton,
    totalCount,
  };
};
