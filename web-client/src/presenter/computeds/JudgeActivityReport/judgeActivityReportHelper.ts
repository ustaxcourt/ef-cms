import { state } from 'cerebral';
export const judgeActivityReportHelper = (get, applicationContext) => {
  const { casesClosedByJudge, opinions, orders, trialSessions } = get(
    state.judgeActivityReportData,
  );
  const { judgeName } = get(state.form);

  let showSelectDateRangeText = false;

  let closedCasesTotal,
    trialSessionsHeldTotal,
    opinionsFiledTotal,
    ordersFiledTotal;
  const hasFormBeenSubmitted =
    casesClosedByJudge && opinions && orders && trialSessions;

  if (hasFormBeenSubmitted) {
    closedCasesTotal = Object.values(casesClosedByJudge).reduce(
      (a: number, b: number) => a + b,
      0,
    );

    trialSessionsHeldTotal = Object.values(trialSessions).reduce(
      (a: number, b: number) => a + b,
      0,
    );

    opinionsFiledTotal = opinions.reduce((a: any, b: any) => a + b.count, 0);

    ordersFiledTotal = orders.reduce((a: any, b: any) => a + b.count, 0);
  } else {
    showSelectDateRangeText = true;
  }

  const resultsCount =
    ordersFiledTotal +
    opinionsFiledTotal +
    trialSessionsHeldTotal +
    closedCasesTotal;

  const showResults = resultsCount > 0;

  const currentDate = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );

  const reportHeader = `${judgeName} ${currentDate}`;

  return {
    closedCasesTotal,
    opinionsFiledTotal,
    ordersFiledTotal,
    reportHeader,
    showResults,
    showSelectDateRangeText,
    trialSessionsHeldTotal,
  };
};
