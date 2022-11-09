import { state } from 'cerebral';

export const dashboardExternalHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();

  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];

  const cases = [...openCases, ...closedCases];

  let showFileACase = false;

  if (user.role === USER_ROLES.privatePractitioner) {
    showFileACase = true;
  }
  return {
    showCaseList: cases.length > 0,
    showFileACase,
    showWhatToExpect: cases.length === 0,
  };
};
