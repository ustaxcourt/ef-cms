import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'cerebral';
import { formatDateString } from '@shared/business/utilities/DateHandler';

export const caseStatusHistoryHelper = (get: Get): any => {
  const caseStatusHistory = get(state.caseDetail.caseStatusHistory);
  return {
    formattedCaseStatusHistory: caseStatusHistory?.map(history => ({
      ...history,
      formattedDateChanged: formatDateString(history.date, 'MMDDYY'),
    })),
    isTableDisplayed: caseStatusHistory && caseStatusHistory.length > 0,
  };
};
