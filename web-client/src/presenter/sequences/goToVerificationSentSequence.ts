import { checkIfCognitoEmailInState } from '@web-client/presenter/actions/checkIfCognitoEmailInState';
import { gotoPublicSearchSequence } from '@web-client/presenter/sequences/Public/gotoPublicSearchSequence';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const goToVerificationSentSequence = [
  checkIfCognitoEmailInState,
  {
    doesNotExist: [gotoPublicSearchSequence],
    exists: [setupCurrentPageAction('VerificationSent')],
  },
];
