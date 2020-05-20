import { state } from 'cerebral';

/**
 * computes the dates for the statistics array from the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const computeStatisticDatesAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { statistics } = get(state.form);

  (statistics || []).forEach((statistic, index) => {
    if (
      applicationContext
        .getUtilities()
        .isValidDateString(
          `${statistic.lastDateOfPeriodMonth}-${statistic.lastDateOfPeriodDay}-${statistic.lastDateOfPeriodYear}`,
        )
    ) {
      const computedLastDateOfPeriod = applicationContext
        .getUtilities()
        .createISODateStringFromObject({
          day: statistic.lastDateOfPeriodDay,
          month: statistic.lastDateOfPeriodMonth,
          year: statistic.lastDateOfPeriodYear,
        });
      store.set(
        state.form.statistics[index].lastDateOfPeriod,
        computedLastDateOfPeriod,
      );
    }
  });
};
