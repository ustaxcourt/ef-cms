import { state } from 'cerebral';

export const blockedCasesReportHelper = get => {
  const blockedCases = get(state.blockedCases);

  return {
    blockedCasesCount: blockedCases && blockedCases.length,
  };
};
