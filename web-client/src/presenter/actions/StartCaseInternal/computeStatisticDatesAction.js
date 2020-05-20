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
  let { statistics } = get(state.form);

  statistics = statistics.filter(
    statistic =>
      statistic.year ||
      statistic.lastDateOfPeriodDay ||
      statistic.lastDateOfPeriodMonth ||
      statistic.lastDateOfPeriodYear ||
      statistic.deficiencyAmount ||
      statistic.totalPenalties,
  );

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
      statistics[index].lastDateOfPeriod = computedLastDateOfPeriod;
    }
  });

  if (statistics.length === 0) {
    statistics.push({
      yearOrPeriod: 'Year',
    });
  }
  store.set(state.form.statistics, statistics);
};
