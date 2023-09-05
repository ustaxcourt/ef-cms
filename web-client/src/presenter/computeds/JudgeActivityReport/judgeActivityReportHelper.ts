import { CAV_AND_SUBMITTED_CASES_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { OrdersReturnType } from '../../../../../shared/src/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor';
import { state } from '@web-client/presenter/app.cerebral';

interface IJudgeActivityReportHelper {
  closedCasesTotal: number | undefined;
  submittedAndCavCasesByJudge: any | undefined;
  isFormPristine: boolean | undefined;
  opinionsFiledTotal: number | undefined;
  ordersFiledTotal: number | undefined;
  progressDescriptionTableTotal: number | undefined;
  reportHeader: string | undefined;
  showResultsTables: boolean | undefined;
  showSelectDateRangeText: boolean | undefined;
  trialSessionsHeldTotal: number | undefined;
  today: string;
  showPaginator: boolean;
  pageCount: number;
  orders: OrdersReturnType;
}

export const judgeActivityReportHelper = (
  get: any,
  applicationContext: IApplicationContext,
): IJudgeActivityReportHelper => {
  const { endDate, judgeNameToDisplayForHeader, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const {
    casesClosedByJudge,
    consolidatedCasesGroupCountMap,
    opinions,
    orders = [],
    submittedAndCavCasesByJudge = [],
    totalCountForSubmittedAndCavCases,
    trialSessions,
  } = get(state.judgeActivityReport.judgeActivityReportData);

  let resultsCount: number = 0,
    showSelectDateRangeText: boolean = false;

  const hasFormBeenSubmitted: boolean =
    casesClosedByJudge && opinions && orders && trialSessions;

  if (hasFormBeenSubmitted) {
    resultsCount =
      orders.total +
      opinions.total +
      trialSessions.total +
      casesClosedByJudge.total;
  } else {
    showSelectDateRangeText = true;
  }

  const currentDate: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );

  const reportHeader: string = `${judgeNameToDisplayForHeader} ${currentDate}`;

  submittedAndCavCasesByJudge.forEach(individualCase => {
    individualCase.formattedCaseCount =
      consolidatedCasesGroupCountMap[individualCase.docketNumber] || 1;
    if (individualCase.leadDocketNumber === individualCase.docketNumber) {
      individualCase.consolidatedIconTooltipText = 'Lead case';
      individualCase.isLeadCase = true;
      individualCase.inConsolidatedGroup = true;
    }
  });

  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  const pageCount = Math.ceil(
    totalCountForSubmittedAndCavCases / CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
  );

  const ordersToDisplay = orders.aggregations?.filter(agg => agg.count);

  return {
    closedCasesTotal: casesClosedByJudge?.total || 0,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal: opinions?.total || 0,
    orders: ordersToDisplay,
    ordersFiledTotal: orders?.total || 0,
    pageCount,
    progressDescriptionTableTotal: totalCountForSubmittedAndCavCases || 0,
    reportHeader,
    showPaginator: pageCount > 1,
    showResultsTables: resultsCount > 0,
    showSelectDateRangeText,
    submittedAndCavCasesByJudge,
    today,
    trialSessionsHeldTotal: trialSessions?.total || 0,
  };
};
