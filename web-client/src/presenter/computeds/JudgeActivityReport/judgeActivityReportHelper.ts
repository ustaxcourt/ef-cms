import { state } from 'cerebral';
import { sum, sumBy } from 'lodash';

export const judgeActivityReportHelper = (get, applicationContext) => {
  const { endDate, judgeName, startDate } = get(state.form);

  const {
    casesClosedByJudge,
    consolidatedCasesGroupCountMap,
    opinions,
    orders,
    submittedAndCavCasesByJudge = [],
    trialSessions,
  } = get(state.judgeActivityReportData);

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

  const reportHeader: string = `${judgeName} ${currentDate}`;

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.ISO,
    );

  const filteredSubmittedAndCavCasesByJudge =
    submittedAndCavCasesByJudge.filter(
      unfilteredCase => unfilteredCase.caseStatusHistory.length > 0,
    );

  filteredSubmittedAndCavCasesByJudge.forEach(individualCase => {
    individualCase.formattedCaseCount =
      consolidatedCasesGroupCountMap.get(individualCase.docketNumber) || 1;
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

  filteredSubmittedAndCavCasesByJudge.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  return {
    closedCasesTotal,
    filteredSubmittedAndCavCasesByJudge,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal,
    ordersFiledTotal,
    progressDescriptionTableTotal: filteredSubmittedAndCavCasesByJudge.length,
    reportHeader,
    showResultsTables: resultsCount > 0,
    showSelectDateRangeText,
    trialSessionsHeldTotal,
  };
};
