import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

const formatCaseDeadline = (applicationContext, caseDeadline) => {
  const result = cloneDeep(caseDeadline);
  result.deadlineDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(result.deadlineDate, 'MMDDYY');

  // use the app context utility function so the time zones match when comparing dates
  const deadlineDate = applicationContext
    .getUtilities()
    .prepareDateFromString(result.deadlineDate);

  const today = applicationContext.getUtilities().prepareDateFromString();

  const deadLineIsBeforeToday =
    deadlineDate.startOf('day') < today.startOf('day');
  if (deadLineIsBeforeToday) {
    result.overdue = true;
  }

  return result;
};

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const formattedCaseDeadlines = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDeadlines = get(state.caseDeadlines);

  const caseDeadlinesFormatted = (caseDeadlines || [])
    .map(d => formatCaseDeadline(applicationContext, d))
    .sort((a, b) =>
      String.prototype.localeCompare.call(a.deadlineDate, b.deadlineDate),
    );

  return caseDeadlinesFormatted;
};
