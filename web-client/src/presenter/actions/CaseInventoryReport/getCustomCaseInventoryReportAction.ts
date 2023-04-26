import {
  CustomCaseInventoryReportFilters,
  GetCaseInventoryReportResponse,
} from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

export const CUSTOM_CASE_INVENTORY_PAGE_SIZE = 2; // TODO: change to 100
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
  const filterValues: CustomCaseInventoryReportFilters = get(
    state.customCaseInventory.filters,
  );

  const formattedStartDate = applicationContext
    .getUtilities()
    .createISODateString(filterValues.createStartDate, FORMATS.MMDDYYYY);
  const formattedEndDate = applicationContext
    .getUtilities()
    .createISODateString(filterValues.createEndDate, FORMATS.MMDDYYYY);

  const reportData: GetCaseInventoryReportResponse = await applicationContext
    .getUseCases()
    .getCustomCaseInventoryReportInteractor(applicationContext, {
      ...filterValues,
      createEndDate: formattedEndDate,
      createStartDate: formattedStartDate,
      pageNumber: props.selectedPage,
      pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
    });

  store.set(state.customCaseInventory.cases, reportData.foundCases);
  store.set(state.customCaseInventory.totalCases, reportData.totalCount);
};
