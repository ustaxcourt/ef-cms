import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';

type FormattedCaseDeadlinesType = RawCaseDeadline & {
  deadlineDateFormatted: string;
  overdue?: boolean;
};

const formatCaseDeadline = (
  applicationContext: ClientApplicationContext,
  _caseDeadline: RawCaseDeadline,
): FormattedCaseDeadlinesType => {
  const caseDeadline = cloneDeep(_caseDeadline);

  const deadlineDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(caseDeadline.deadlineDate, 'MMDDYY');

  // use the app context utility function so the time zones match when comparing dates
  const deadlineDate = applicationContext
    .getUtilities()
    .prepareDateFromString(caseDeadline.deadlineDate);

  const today = applicationContext.getUtilities().prepareDateFromString();

  const deadLineIsBeforeToday =
    deadlineDate.startOf('day') < today.startOf('day');

  const result: FormattedCaseDeadlinesType = {
    ...caseDeadline,
    deadlineDateFormatted,
    overdue: deadLineIsBeforeToday || undefined,
  };

  return result;
};

export const formattedCaseDeadlines = (
  get: Get,
  applicationContext: ClientApplicationContext,
): FormattedCaseDeadlinesType[] => {
  const caseDeadlines = get(state.caseDeadlines) || [];

  return caseDeadlines
    .map(d => formatCaseDeadline(applicationContext, d))
    .sort((a, b) =>
      String.prototype.localeCompare.call(a.deadlineDate, b.deadlineDate),
    );
};
