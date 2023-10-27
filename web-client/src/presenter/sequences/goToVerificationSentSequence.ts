import { checkIfCognitoEmailInState } from '@web-client/presenter/actions/checkIfCognitoEmailInState';
import { navigateToCognitoAction } from '@web-client/presenter/actions/navigateToCognitoAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const goToVerificationSentSequence = [
  checkIfCognitoEmailInState,
  {
    doesNotExist: [navigateToCognitoAction],
    exists: [setupCurrentPageAction('VerificationSent')],
  },
];
