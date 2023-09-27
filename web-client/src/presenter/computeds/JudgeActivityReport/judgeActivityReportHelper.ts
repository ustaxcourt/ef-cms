import {
  ASCENDING,
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
} from '@shared/business/entities/EntityConstants';
import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { getSubmittedOrCAVDate } from '@web-client/presenter/computeds/CaseWorksheets/caseWorksheetsHelper';
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
  orders: AggregatedEventCodesType;
}

export const judgeActivityReportHelper = (
  get: any,
  applicationContext: IApplicationContext,
): IJudgeActivityReportHelper => {
  const { endDate, startDate } = get(state.judgeActivityReport.filters);

  const { judgeNameToDisplayForHeader } = get(state.judgeActivityReport);

  const {
    casesClosedByJudge,
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
    if (individualCase.leadDocketNumber === individualCase.docketNumber) {
      individualCase.consolidatedIconTooltipText = 'Lead case';
      individualCase.isLeadCase = true;
      individualCase.inConsolidatedGroup = true;
    }

    individualCase.statusDate = individualCase.caseStatusHistory
      ? getSubmittedOrCAVDate(
          applicationContext,
          individualCase.caseStatusHistory,
        )
      : '';

    if (individualCase.caseWorksheet) {
      individualCase.caseWorksheet.formattedFinalBriefDueDate = individualCase
        .caseWorksheet.finalBriefDueDate
        ? applicationContext
            .getUtilities()
            .formatDateString(
              individualCase.caseWorksheet.finalBriefDueDate,
              applicationContext.getConstants().DATE_FORMATS.MMDDYY,
            )
        : '';
    }
  });

  const { sortField, sortOrder } = get(state.tableSort);
  console.log(sortField, sortOrder);

  submittedAndCavCasesByJudge.sort((a, b) => {
    if (sortField === 'daysElapsedSinceLastStatusChange') {
      return sortOrder === ASCENDING
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else if (sortField === 'associatedJudge') {
      return sortOrder === ASCENDING
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
  });

  console.log(submittedAndCavCasesByJudge[0]);

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
