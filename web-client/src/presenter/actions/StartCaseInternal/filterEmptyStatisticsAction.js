import { state } from 'cerebral';

/**
 * filters out any statistics that are empty
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const filterEmptyStatisticsAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { caseType, hasVerifiedIrsNotice } = get(state.form);
  let statistics = get(state.form.statistics) || [];

  statistics = statistics.filter(
    statistic =>
      statistic.year ||
      statistic.lastDateOfPeriodDay ||
      statistic.lastDateOfPeriodMonth ||
      statistic.lastDateOfPeriodYear ||
      statistic.irsDeficiencyAmount ||
      statistic.irsTotalPenalties,
  );

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
