import { checkIfCognitoEmailInState } from '@web-client/presenter/actions/checkIfCognitoEmailInState';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const goToVerificationSentSequence = [
  checkIfCognitoEmailInState,
  {
    doesNotExist: [navigateToLoginSequence],
    exists: [setupCurrentPageAction('VerificationSent')],
  },
];
