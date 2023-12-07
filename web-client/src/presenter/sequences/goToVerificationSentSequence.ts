import { checkIfCognitoEmailInState } from '@web-client/presenter/actions/checkIfCognitoEmailInState';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const goToVerificationSentSequence = [
  checkIfCognitoEmailInState,
  {
    doesNotExist: [gotoLoginSequence],
    exists: [setupCurrentPageAction('VerificationSent')],
  },
];
