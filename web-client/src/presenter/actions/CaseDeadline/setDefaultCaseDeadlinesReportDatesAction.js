import { state } from 'cerebral';

/**
 * sets default start and end date for case deadlines report to today's date
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the store
 */
export const setDefaultCaseDeadlinesReportDatesAction = ({
  applicationContext,
  store,
}) => {
  const { day, month, year } = applicationContext
    .getUtilities()
    .deconstructDate(applicationContext.getUtilities().createISODateString());
  const currentDateStart = applicationContext
    .getUtilities()
    .createStartOfDayISO({ day, month, year });
  const currentDateEnd = applicationContext
    .getUtilities()
    .createEndOfDayISO({ day, month, year });

  store.set(state.screenMetadata.filterStartDate, currentDateStart);
  store.set(state.screenMetadata.filterEndDate, currentDateEnd);
};
