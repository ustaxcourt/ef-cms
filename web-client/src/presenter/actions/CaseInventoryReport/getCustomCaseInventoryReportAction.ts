import { state } from 'cerebral';

export const CUSTOM_CASE_INVENTORY_PAGE_SIZE = 5;
// TODO 9723: add a type to this action
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
  props,
  store,
}) => {
  const filterValues = get(state.customCaseInventory.filters);

  // TODO 9723:  add a type to reportData
  const reportData = await applicationContext
    .getUseCases()
    .getCustomCaseInventoryReportInteractor(applicationContext, {
      ...filterValues,
      pageNumber: props.selectedPage,
      pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
    });

  store.set(state.customCaseInventory.cases, reportData.foundCases);
  store.set(state.customCaseInventory.totalCases, reportData.totalCount);
};
