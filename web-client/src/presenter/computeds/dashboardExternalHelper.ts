import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const dashboardExternalHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  showFileACase: boolean;
  showFilingFee: boolean;
  showStartButton: boolean;
  showPetitionWelcomePage: boolean;
} => {
  const { USER_ROLES } = applicationContext.getConstants();
  const user = get(state.user);

  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];

  const cases = [...openCases, ...closedCases];

  let showFileACase = false;
  let showStartButton = false;
  let showFilingFee = false;

  if (user.role === USER_ROLES.privatePractitioner) {
    showFileACase = true;
  }

  if (
    user.role === USER_ROLES.privatePractitioner ||
    user.role === USER_ROLES.petitioner
  ) {
    showStartButton = true;
    showFilingFee = true;
  }

  return {
    showFileACase,
    showFilingFee,
    showPetitionWelcomePage: cases.length === 0,
    showStartButton,
  };
};
