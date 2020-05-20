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
  filterEmptyStatistics,
} = {}) => ({ applicationContext, get, store }) => {
  const { caseType, hasVerifiedIrsNotice } = get(state.form);
  let statistics = get(state.form.statistics) || [];

  statistics = statistics
    .filter(
      statistic =>
        !filterEmptyStatistics ||
        statistic.year ||
        statistic.lastDateOfPeriodDay ||
        statistic.lastDateOfPeriodMonth ||
        statistic.lastDateOfPeriodYear ||
        statistic.deficiencyAmount ||
        statistic.totalPenalties,
    )
    .map(statistic => {
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
        statistic.lastDateOfPeriod = computedLastDateOfPeriod;
      }
      return statistic;
    });

  const { CASE_TYPES_MAP } = applicationContext.getConstants();

  if (
    caseType === CASE_TYPES_MAP.deficiency &&
    hasVerifiedIrsNotice &&
    statistics &&
    statistics.length === 0
  ) {
    statistics.push({
      yearOrPeriod: 'Year',
    });
  }

  store.set(state.form.statistics, statistics);
};
