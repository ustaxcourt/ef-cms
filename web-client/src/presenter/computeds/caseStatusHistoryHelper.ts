import { state } from '@web-client/presenter/app.cerebral';

/**
 * a computed used for formatting the case status history table entries.
 *
 * @param {*} get cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} array of case types with descriptions
 */
export const caseStatusHistoryHelper = (get, applicationContext) => {
  const caseStatusHistory = get(state.caseDetail.caseStatusHistory);

  return {
    formattedCaseStatusHistory: caseStatusHistory.map(history => ({
      ...history,
      formattedDateChanged: applicationContext
        .getUtilities()
        .formatDateString(history.date, 'MMDDYY'),
    })),
    isTableDisplayed: caseStatusHistory.length > 0,
  };
};
