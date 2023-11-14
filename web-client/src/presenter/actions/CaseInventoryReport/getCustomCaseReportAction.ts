import { CUSTOM_CASE_REPORT_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getCustomCaseReportAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{ selectedPage: number }>) => {
  const filterValues = get(state.customCaseReport.filters);

  if (!filterValues.highPriority) {
    delete filterValues.highPriority;
  }

  let formattedStartDate: string | undefined;
  if (filterValues.startDate) {
    const [startMonth, startDay, startYear] = filterValues.startDate.split('/');
    formattedStartDate = applicationContext.getUtilities().createStartOfDayISO({
      day: startDay,
      month: startMonth,
      year: startYear,
    });
  }

  let formattedEndDate: string | undefined;
  if (filterValues.endDate) {
    const [endMonth, endDay, endYear] = filterValues.endDate.split('/');
    formattedEndDate = applicationContext
      .getUtilities()
      .createEndOfDayISO({ day: endDay, month: endMonth, year: endYear });
  }

  const lastIdsOfPages = get(state.customCaseReport.lastIdsOfPages);
  const searchAfter = lastIdsOfPages[props.selectedPage];

  const reportData = await applicationContext
    .getUseCases()
    .getCustomCaseReportInteractor(applicationContext, {
      ...filterValues,
      endDate: formattedEndDate,
      pageSize: CUSTOM_CASE_REPORT_PAGE_SIZE,
      searchAfter,
      startDate: formattedStartDate,
    });

  store.set(
    state.customCaseReport.lastIdsOfPages[props.selectedPage + 1],
    reportData.lastCaseId,
  );

  store.set(state.customCaseReport.cases, reportData.foundCases);
  store.set(state.customCaseReport.totalCases, reportData.totalCount);
};
