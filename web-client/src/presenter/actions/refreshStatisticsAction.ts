import { state } from '@web-client/presenter/app.cerebral';

/**
 * refreshes the default value of the statistics
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function getting the batch to delete
 * @param {object} providers.store the cerebral store used for setting the new batch state
 * @returns {void}
 */

export const refreshStatisticsAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  let { caseType, hasVerifiedIrsNotice, statistics } = get(state.form);

  if (caseType !== CASE_TYPES_MAP.deficiency || !hasVerifiedIrsNotice) {
    statistics.splice(0, statistics.length);
    return;
  }

  const newStatisticWithId = {
    statisticId: applicationContext.getUniqueId(),
    yearOrPeriod: 'Year',
  };

  if (statistics && statistics.length < 12) {
    statistics.push(newStatisticWithId);
  } else if (!statistics) {
    statistics = [newStatisticWithId];
  }

  store.set(state.form.statistics, statistics);
};
