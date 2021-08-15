import { state } from 'cerebral';

/**
 * refreshes the default value of the statistics
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function getting the batch to delete
 * @param {object} providers.store the cerebral store used for setting the new batch state
 * @returns {void}
 */

export const refreshStatisticsAction = ({ applicationContext, get, store }) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  let { caseType, hasVerifiedIrsNotice, statistics } = get(state.form);

  if (caseType !== CASE_TYPES_MAP.deficiency || !hasVerifiedIrsNotice) {
    statistics.splice(0, statistics.length);
  } else {
    if (statistics && statistics.length < 12) {
      statistics.push({
        yearOrPeriod: 'Year',
      });
      store.set(state.form.statistics, statistics);
    } else if (!statistics) {
      statistics = [
        {
          yearOrPeriod: 'Year',
        },
      ];
      store.set(state.form.statistics, statistics);
    }
  }
};
