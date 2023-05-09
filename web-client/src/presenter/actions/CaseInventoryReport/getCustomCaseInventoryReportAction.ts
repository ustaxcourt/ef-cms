import {
  CustomCaseInventoryReportFilters,
  GetCaseInventoryReportResponse,
} from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

export const CUSTOM_CASE_INVENTORY_PAGE_SIZE = 10;
/**
 * get the case inventory report data
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
}: {
  applicationContext: IApplicationContext;
  get: any;
  props: { selectedPage: number };
  store: any;
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

  const lastIdsOfPages = get(state.customCaseInventory.lastIdsOfPages);
  const pageToGoTo = lastIdsOfPages[props.selectedPage];

  const reportData: GetCaseInventoryReportResponse = await applicationContext
    .getUseCases()
    .getCustomCaseInventoryReportInteractor(applicationContext, {
      ...filterValues,
      createEndDate: formattedEndDate,
      createStartDate: formattedStartDate,
      pageNumber: props.selectedPage,
      pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
      searchAfter: pageToGoTo,
    });

  store.set(
    state.customCaseInventory.lastIdsOfPages[props.selectedPage + 1],
    reportData.lastCaseId,
  );

  store.set(state.customCaseInventory.cases, reportData.foundCases);
  store.set(state.customCaseInventory.totalCases, reportData.totalCount);
};
