import { CUSTOM_CASE_INVENTORY_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  CustomCaseInventoryReportFilters,
  GetCaseInventoryReportResponse,
} from '../../../../../web-api/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { state } from '@web-client/presenter/app.cerebral';

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

  if (!filterValues.highPriority) {
    delete filterValues.highPriority;
  }

  const [startMonth, startDay, startYear] = filterValues.startDate.split('/');

  const formattedStartDate = filterValues.startDate
    ? applicationContext.getUtilities().createStartOfDayISO({
        day: startDay,
        month: startMonth,
        year: startYear,
      })
    : undefined;

  const [endMonth, endDay, endYear] = filterValues.endDate.split('/');
  const formattedEndDate = filterValues.endDate
    ? applicationContext
        .getUtilities()
        .createEndOfDayISO({ day: endDay, month: endMonth, year: endYear })
    : undefined;

  const lastIdsOfPages = get(state.customCaseInventory.lastIdsOfPages);
  const searchAfter = lastIdsOfPages[props.selectedPage];

  const reportData: GetCaseInventoryReportResponse = await applicationContext
    .getUseCases()
    .getCustomCaseInventoryReportInteractor(applicationContext, {
      ...filterValues,
      endDate: formattedEndDate,
      pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
      searchAfter,
      startDate: formattedStartDate,
    });

  store.set(
    state.customCaseInventory.lastIdsOfPages[props.selectedPage + 1],
    reportData.lastCaseId,
  );

  store.set(state.customCaseInventory.cases, reportData.foundCases);
  store.set(state.customCaseInventory.totalCases, reportData.totalCount);
};
