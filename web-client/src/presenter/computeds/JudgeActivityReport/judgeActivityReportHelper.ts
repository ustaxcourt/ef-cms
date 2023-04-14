import { state } from 'cerebral';

export const judgeActivityReportHelper = get => {
  const { trialSessions } = get(state.judgeActivityReportData);

  let trialSessionsHeldTotal: number = 0;
  if (trialSessions) {
    trialSessionsHeldTotal = Object.values(trialSessions).reduce(
      (a: number, b: number) => a + b,
      0,
    );
  }

  return {
    trialSessionsHeldTotal,
  };
};
