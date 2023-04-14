import { state } from 'cerebral';

export const judgeActivityReportHelper = get => {
  const { casesClosedByJudge, trialSessions } = get(
    state.judgeActivityReportData,
  );

  const closedCasesTotal: number = Object.values(
    casesClosedByJudge || {},
  ).reduce((a: number, b: number) => a + b, 0);

  const trialSessionsHeldTotal: number = Object.values(
    trialSessions || {},
  ).reduce((a: number, b: number) => a + b, 0);

  return {
    closedCasesTotal,
    trialSessionsHeldTotal,
  };
};
