import { state } from 'cerebral';

/**
 * get case deadlines between start and end date
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {function} providers.get the get function
 * @returns {object} the case deadlines
 */
export const clearCaseDeadlineReportAction = async ({ store }) => {
  store.set(state.caseDeadlineReport, {});
};
