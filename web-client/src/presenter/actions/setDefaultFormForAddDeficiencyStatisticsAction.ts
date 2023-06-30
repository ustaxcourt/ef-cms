import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form yearOrPeriod
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 * @param {object} providers.applicationContext the application context
 */
export const setDefaultFormForAddDeficiencyStatisticsAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.form, {
    penalties: [],
    statisticId: applicationContext.getUniqueId(),
    yearOrPeriod: 'Year',
  });
};
