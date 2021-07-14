import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

const formatCaseDeadline = (applicationContext, caseDeadline) => {
  const result = cloneDeep(caseDeadline);
  result.deadlineDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.deadlineDate, 'MMDDYY');

  // use the app context utility function so the time zones match when comparing dates
  const deadlineDateMomented = applicationContext
    .getUtilities()
    .prepareDateFromString(result.deadlineDate);

  const today = applicationContext.getUtilities().prepareDateFromString();

  if (deadlineDateMomented.isBefore(today, 'day')) {
    result.overdue = true;
  }

  return result;
};

export const formattedCaseDeadlines = (get, applicationContext) => {
  const caseDeadlines = get(state.caseDeadlines);

  const caseDeadlinesFormatted = (caseDeadlines || [])
    .map(d => formatCaseDeadline(applicationContext, d))
    .sort((a, b) =>
      String.prototype.localeCompare.call(a.deadlineDate, b.deadlineDate),
    );

  return caseDeadlinesFormatted;
};
