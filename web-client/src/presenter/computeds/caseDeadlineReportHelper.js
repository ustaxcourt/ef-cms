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
  let caseDeadlines = get(state.allCaseDeadlines) || [];
  let filterStartDate = get(state.screenMetadata.filterStartDate);
  let filterEndDate = get(state.screenMetadata.filterEndDate);

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

  const filterByDate = date => {
    if (
      filterStartDate &&
      (!filterEndDate || filterStartDate === filterEndDate)
    ) {
      return date.isSame(filterStartDate, 'day');
    } else if (
      filterStartDate &&
      filterEndDate &&
      filterStartDate !== filterEndDate
    ) {
      return date.isBetween(filterStartDate, filterEndDate, 'day', 'day');
    }
  };

  caseDeadlines = caseDeadlines
    .sort(sortByDateAndDocketNumber(applicationContext))
    .map(d => ({
      ...d,
      deadlineDateReal: applicationContext
        .getUtilities()
        .prepareDateFromString(d.deadlineDate),
      formattedDeadline: applicationContext
        .getUtilities()
        .formatDateString(d.deadlineDate, 'MMDDYY'),
      formattedDocketNumber: `${d.docketNumber}${d.docketNumberSuffix || ''}`,
    }))
    .filter(d => filterByDate(d.deadlineDateReal));

  return {
    caseDeadlineCount: caseDeadlines.length,
    caseDeadlines,
    formattedFilterDateHeader,
  };
};
