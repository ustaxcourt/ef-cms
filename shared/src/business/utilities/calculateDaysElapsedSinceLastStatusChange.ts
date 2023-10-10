import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { isEmpty } from 'lodash';

export const calculateDaysElapsedSinceLastStatusChange = (
  applicationContext: IApplicationContext,
  individualCase: {
    caseStatusHistory: CaseStatusChange[];
  },
): { daysElapsedSinceLastStatusChange: number; statusDate: string } => {
  if (isEmpty(individualCase.caseStatusHistory)) {
    return { daysElapsedSinceLastStatusChange: 0, statusDate: '' };
  }

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      FORMATS.ISO,
    );

  individualCase.caseStatusHistory.sort((a, b) =>
    applicationContext.getUtilities().compareISODateStrings(a.date, b.date),
  );

  const newestCaseStatusChangeIndex =
    individualCase.caseStatusHistory.length - 1;

  const dateOfLastCaseStatusChange =
    individualCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

  return {
    daysElapsedSinceLastStatusChange: applicationContext
      .getUtilities()
      .calculateDifferenceInDays(
        currentDateInIsoFormat,
        dateOfLastCaseStatusChange,
      ),
    statusDate: applicationContext
      .getUtilities()
      .formatDateString(dateOfLastCaseStatusChange, FORMATS.MMDDYY),
  };
};
