import { state } from 'cerebral';

export const dashboardExternalHelper = (get, applicationContext) => {
  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];
  const cases = [...openCases, ...closedCases];
  const user = applicationContext.getCurrentUser() || {};
  const { USER_ROLES } = applicationContext.getConstants();

  return {
    showCaseList: cases.length > 0,
    showCaseSearch: [
      USER_ROLES.privatePractitioner,
      USER_ROLES.irsPractitioner,
    ].includes(user.role),
    showWhatToExpect: cases.length === 0,
  };
};
