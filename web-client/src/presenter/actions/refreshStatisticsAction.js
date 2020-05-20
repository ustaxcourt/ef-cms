import { state } from 'cerebral';

/**
 * refreshes the default value of the statistics
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function getting the batch to delete
 * @param {object} providers.store the cerebral store used for setting the new batch state
 * @returns {void}
 */

export const refreshStatisticsAction = async ({ get, store }) => {
  let { caseType, hasVerifiedIrsNotice, statistics } = get(state.form);

  if (caseType !== 'Deficiency' || !hasVerifiedIrsNotice) {
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
