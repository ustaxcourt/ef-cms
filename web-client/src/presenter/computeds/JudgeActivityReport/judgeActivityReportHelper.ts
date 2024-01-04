import { ASCENDING } from '@shared/business/entities/EntityConstants';
import { CaseDocumentsCountType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

function calculateStatisticsTotal(
  casesClosedByJudge,
  opinions,
  orders,
  trialSessions,
) {
  if (!orders && !opinions && !trialSessions && !casesClosedByJudge) {
    return 0;
  }
  return (
    orders.total +
    opinions.total +
    trialSessions.total +
    casesClosedByJudge.total
  );
}

export const judgeActivityReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  closedCasesTotal: number;
  isFormPristine: boolean;
  opinionsFiledTotal: number;
  orders: CaseDocumentsCountType[];
  ordersFiledTotal: number;
  progressDescriptionTableTotal: number;
  reportHeader: string;
  showResultsTables: boolean;
  submittedAndCavCasesByJudge: any;
  today: string;
  trialSessionsHeldTotal: number;
} => {
  const { endDate, startDate } = get(state.judgeActivityReport.filters);

  const { judgeName } = get(state.judgeActivityReport.filters);

  const judgeActivityReportData = get(
    state.judgeActivityReport.judgeActivityReportData,
  );

  const hasFormBeenSubmitted = get(
    state.judgeActivityReport.hasUserSubmittedForm,
  );

  const totalResults = calculateStatisticsTotal(
    judgeActivityReportData.casesClosedByJudge,
    judgeActivityReportData.opinions,
    judgeActivityReportData.orders,
    judgeActivityReportData.trialSessions,
  );

  const showResultsTables = hasFormBeenSubmitted && totalResults > 0;

  const currentDate: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );

  const reportHeader: string = `${judgeName} ${currentDate}`;

  const submittedAndCavCasesRows = (
    judgeActivityReportData.submittedAndCavCasesByJudge || []
  ).map(aCase => {
    let consolidatedIconTooltipText = '';
    let isLeadCase = false;
    let inConsolidatedGroup = false;
    let formattedFinalBriefDueDate = '';

    if (aCase.leadDocketNumber === aCase.docketNumber) {
      consolidatedIconTooltipText = 'Lead case';
      isLeadCase = true;
      inConsolidatedGroup = true;
    }

    if (aCase.caseWorksheet) {
      formattedFinalBriefDueDate = aCase.caseWorksheet.finalBriefDueDate
        ? applicationContext
            .getUtilities()
            .formatDateString(
              aCase.caseWorksheet.finalBriefDueDate,
              applicationContext.getConstants().DATE_FORMATS.MMDDYY,
            )
        : '';
    }

    const { daysElapsedSinceLastStatusChange, statusDate } = applicationContext
      .getUtilities()
      .calculateDaysElapsedSinceLastStatusChange(applicationContext, aCase);

    return {
      ...aCase,
      caseWorksheet: {
        ...aCase.caseWorksheet,
        formattedFinalBriefDueDate,
      },
      consolidatedIconTooltipText,
      daysElapsedSinceLastStatusChange,
      inConsolidatedGroup,
      isLeadCase,
      statusDate,
    };
  });

  const { sortField, sortOrder } = get(state.tableSort);
  submittedAndCavCasesRows.sort((a, b) => {
    if (a[sortField] === b[sortField]) {
      return (
        b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
      );
    } else if (typeof a[sortField] === 'number') {
      return sortOrder === ASCENDING
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else if (typeof a[sortField] === 'string') {
      return sortOrder === ASCENDING
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
    return 0;
  });

  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  const ordersToDisplay = judgeActivityReportData.orders
    ? judgeActivityReportData.orders.aggregations?.filter(agg => agg.count)
    : [];

  return {
    closedCasesTotal: judgeActivityReportData.casesClosedByJudge?.total || 0,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal: judgeActivityReportData.opinions?.total || 0,
    orders: ordersToDisplay,
    ordersFiledTotal: judgeActivityReportData.orders?.total || 0,
    progressDescriptionTableTotal: submittedAndCavCasesRows.length,
    reportHeader,
    showResultsTables,
    submittedAndCavCasesByJudge: submittedAndCavCasesRows,
    today,
    trialSessionsHeldTotal: judgeActivityReportData.trialSessions?.total || 0,
  };
};
