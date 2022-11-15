import { state } from 'cerebral';

export const dashboardExternalHelper = (get, applicationContext) => {
  const { USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();

  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];

  const cases = [...openCases, ...closedCases];

  let showFileACase = false;
  let showStartButton = false;

  if (user.role === USER_ROLES.privatePractitioner) {
    showFileACase = true;
  }

  if (
    user.role === USER_ROLES.privatePractitioner ||
    user.role === USER_ROLES.petitioner
  ) {
    showStartButton = true;
  }

  return {
    showCaseList: cases.length > 0,
    showFileACase,
    showStartButton,
    showWhatToExpect: cases.length === 0,
  };
};
