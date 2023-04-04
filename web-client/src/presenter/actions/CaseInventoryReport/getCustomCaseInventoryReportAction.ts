import { state } from 'cerebral';

/**
 * get the case inventory report data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const getCustomCaseInventoryReportAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const filterValues = get(state.customCaseInventoryFilters);

  const reportData = await applicationContext
    .getUseCases()
    .getCustomCaseInventoryReportInteractor(applicationContext, filterValues);

  store.set(state.customCaseInventoryReportData, reportData);
};
