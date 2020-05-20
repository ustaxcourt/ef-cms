import { state } from 'cerebral';

/**
 * adds a statistic with default yearOrPeriod to the state.form.statistics array
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const addStatisticToFormAction = ({ get, store }) => {
  let statistics = get(state.form.statistics);

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
    store.set(state.form.statistics, [statistics]);
  }
};
