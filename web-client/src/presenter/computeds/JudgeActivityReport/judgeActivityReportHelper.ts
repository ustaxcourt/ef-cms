import { state } from 'cerebral';

export const judgeActivityReportHelper = get => {
  const { casesClosedByJudge, opinions, orders, trialSessions } = get(
    state.judgeActivityReportData,
  );

  // if casesClosedByJudge, opinions, orders, trialSessions, haven't submitted form
  // if casesClosedByJudge, opinions, orders, trialSessions += 0, no results
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
  }

  const resultsCount =
    ordersFiledTotal +
    opinionsFiledTotal +
    trialSessionsHeldTotal +
    closedCasesTotal;

  const showResults = resultsCount > 0;

  return {
    closedCasesTotal,
    opinionsFiledTotal,
    ordersFiledTotal,
    showResults,
    trialSessionsHeldTotal,
  };
};
