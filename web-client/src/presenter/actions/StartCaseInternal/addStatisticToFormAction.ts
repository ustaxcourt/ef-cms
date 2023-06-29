import { state } from '@web-client/presenter/app.cerebral';

/**
 * adds a statistic with default yearOrPeriod to the state.form.statistics array
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.applicationContext the applicationContext
 * @param {object} providers.store the cerebral store
 */
export const addStatisticToFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  let statistics = get(state.form.statistics);

  if (statistics && statistics.length < 12) {
    statistics.push({
      statisticId: applicationContext.getUniqueId(),
      yearOrPeriod: 'Year',
    });
    store.set(state.form.statistics, statistics);
  } else if (!statistics) {
    statistics = [
      {
        statisticId: applicationContext.getUniqueId(),
        yearOrPeriod: 'Year',
      },
    ];
    store.set(state.form.statistics, [statistics]);
  }
};
