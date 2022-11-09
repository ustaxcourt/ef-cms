import { state } from 'cerebral';

export const dashboardExternalHelper = get => {
  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];

  const cases = [...openCases, ...closedCases];

  return {
    showCaseList: cases.length > 0,
    showWhatToExpect: cases.length === 0,
  };
};
