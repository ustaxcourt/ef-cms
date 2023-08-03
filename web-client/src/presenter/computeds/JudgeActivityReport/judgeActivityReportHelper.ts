import { CAV_AND_SUBMITTED_CASES_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';
import { sum, sumBy } from 'lodash';

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
    orders,
    submittedAndCavCasesByJudge = [],
    totalCountForSubmittedAndCavCases,
    trialSessions,
  } = get(state.judgeActivityReport.judgeActivityReportData);

  let closedCasesTotal: number = 0,
    trialSessionsHeldTotal: number = 0,
    opinionsFiledTotal: number = 0,
    ordersFiledTotal: number = 0,
    resultsCount: number = 0,
    showSelectDateRangeText: boolean = false;

  const hasFormBeenSubmitted: boolean =
    casesClosedByJudge && opinions && orders && trialSessions;

  if (hasFormBeenSubmitted) {
    closedCasesTotal = sum(Object.values(casesClosedByJudge));

    trialSessionsHeldTotal = sum(Object.values(trialSessions));

    opinionsFiledTotal = sumBy(
      opinions,
      ({ count }: { count: number }) => count,
    );

    ordersFiledTotal = sumBy(orders, ({ count }: { count: number }) => count);

    resultsCount =
      ordersFiledTotal +
      opinionsFiledTotal +
      trialSessionsHeldTotal +
      closedCasesTotal;
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

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.ISO,
    );

  submittedAndCavCasesByJudge.forEach(individualCase => {
    individualCase.formattedCaseCount =
      consolidatedCasesGroupCountMap[individualCase.docketNumber] || 1;
    if (individualCase.leadDocketNumber === individualCase.docketNumber) {
      individualCase.consolidatedIconTooltipText = 'Lead case';
      individualCase.isLeadCase = true;
      individualCase.inConsolidatedGroup = true;
    }

    individualCase.caseStatusHistory.sort((a, b) => a.date - b.date);

    const newestCaseStatusChangeIndex =
      individualCase.caseStatusHistory.length - 1;

    const dateOfLastCaseStatusChange =
      individualCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

    individualCase.daysElapsedSinceLastStatusChange = applicationContext
      .getUtilities()
      .calculateDifferenceInDays(
        currentDateInIsoFormat,
        dateOfLastCaseStatusChange,
      );
  });

  submittedAndCavCasesByJudge.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });
  const today = applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD);

  const pageCount = Math.ceil(
    totalCountForSubmittedAndCavCases / CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
  );

  return {
    closedCasesTotal,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal,
    ordersFiledTotal,
    pageCount,
    progressDescriptionTableTotal: totalCountForSubmittedAndCavCases,
    reportHeader,
    showPaginator: pageCount > 1,
    showResultsTables: resultsCount > 0,
    showSelectDateRangeText,
    submittedAndCavCasesByJudge,
    today,
    trialSessionsHeldTotal,
  };
};
