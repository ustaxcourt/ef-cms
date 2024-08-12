import { Get } from 'cerebral';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const dashboardExternalHelper = (
  get: Get,
): {
  showFilingFee: boolean;
  showStartButton: boolean;
  showPetitionWelcomePage: boolean;
  welcomeMessageTitle: string;
  welcomeMessage: string;
} => {
  const user = get(state.user);

  const openCases = get(state.openCases) || [];
  const closedCases = get(state.closedCases) || [];

  const cases = [...openCases, ...closedCases];

  let showStartButton = false;
  let showFilingFee = false;

  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.petitioner
  ) {
    showStartButton = true;
    showFilingFee = true;
  }
  const welcomeMessage = messages[user.role]?.welcomeMessage;
  const welcomeMessageTitle = messages[user.role]?.welcomeMessageTitle;

  return {
    showFilingFee,
    showPetitionWelcomePage: cases.length === 0,
    showStartButton,
    welcomeMessage,
    welcomeMessageTitle,
  };
};

const messages = {
  [ROLES.privatePractitioner]: {
    welcomeMessage:
      'Search for the case docket number to file the appropriate document.',
    welcomeMessageTitle: 'Do you need access to an existing case?',
  },
  [ROLES.petitioner]: {
    welcomeMessage:
      'Do not start a new case. Email <a href="mailto:dawson.support@ustaxcourt.gov"> dawson.support@ustaxcourt.gov </a> with your case\'s docket number (e.g. 12345-67) to get access to your existing case.',
    welcomeMessageTitle:
      'Have you already filed a petition by mail or do you want electronic access to your existing case?',
  },
};
