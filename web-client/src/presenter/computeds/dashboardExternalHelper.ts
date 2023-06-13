import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const dashboardExternalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
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
    showFileACase,
    showStartButton,
    showWhatToExpect: cases.length === 0,
  };
};
