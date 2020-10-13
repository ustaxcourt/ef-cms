import { state } from 'cerebral';

/**
 * sets default start and end date for case deadlines report to today's date
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the case deadlines
 */
export const setDefaultCaseDeadlinesReportDatesAction = async ({
  applicationContext,
  store,
}) => {
  const startOfToday = applicationContext.getUtilities().formatNow();
  const endOfToday = applicationContext.getUtilities().formatNow();
  store.set(state.screenMetadata.filterStartDateState, startOfToday);
  store.set(state.screenMetadata.filterEndDateState, endOfToday);
};
