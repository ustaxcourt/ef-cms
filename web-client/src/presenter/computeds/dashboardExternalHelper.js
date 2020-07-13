import { state } from 'cerebral';

export const dashboardExternalHelper = (get, applicationContext) => {
  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];
  const cases = [...openCases, ...closedCases];
  const user = applicationContext.getCurrentUser() || {};

  return {
    showCaseList: cases.length > 0,
    showCaseSearch: ['privatePractitioner', 'irsPractitioner'].includes(
      user.role,
    ),
    showWhatToExpect: cases.length === 0,
  };
};
