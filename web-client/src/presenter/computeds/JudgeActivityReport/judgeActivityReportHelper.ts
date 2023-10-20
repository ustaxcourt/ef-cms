import { ASCENDING } from '@shared/business/entities/EntityConstants';
import { CaseDocumentsCountType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

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
  showSelectDateRangeText: boolean;
  submittedAndCavCasesByJudge: any;
  today: string;
  trialSessionsHeldTotal: number;
} => {
  const { endDate, startDate } = get(state.judgeActivityReport.filters);

  const { judgeNameToDisplayForHeader } = get(state.judgeActivityReport);

  const {
    casesClosedByJudge,
    opinions,
    orders,
    submittedAndCavCasesByJudge = [],
    trialSessions,
  } = get(state.judgeActivityReport.judgeActivityReportData);

  const hasFormBeenSubmitted = get(
    state.judgeActivityReport.hasUserSubmittedForm,
  );

  const totalResults =
    orders.total +
    opinions.total +
    trialSessions.total +
    casesClosedByJudge.total;
  const showResultsTables = hasFormBeenSubmitted && totalResults > 0;

  const showSelectDateRangeText = !hasFormBeenSubmitted;

  const currentDate: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );

  const reportHeader: string = `${judgeNameToDisplayForHeader} ${currentDate}`;

  const submittedAndCavCasesRows = submittedAndCavCasesByJudge.map(aCase => {
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

  const ordersToDisplay = orders.aggregations?.filter(agg => agg.count);

  return {
    closedCasesTotal: casesClosedByJudge?.total || 0,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal: opinions?.total || 0,
    orders: ordersToDisplay,
    ordersFiledTotal: orders?.total || 0,
    progressDescriptionTableTotal: submittedAndCavCasesRows.length,
    reportHeader,
    showResultsTables,
    showSelectDateRangeText,
    submittedAndCavCasesByJudge: submittedAndCavCasesRows,
    today,
    trialSessionsHeldTotal: trialSessions?.total || 0,
  };
};
