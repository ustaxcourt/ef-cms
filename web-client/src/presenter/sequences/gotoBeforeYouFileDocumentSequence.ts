import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoBeforeYouFileDocument = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  getCaseAction,
  setCaseAction,
  setCurrentPageAction('BeforeYouFileADocument'),
]);

export const gotoBeforeYouFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoBeforeYouFileDocument,
    unauthorized: [redirectToCognitoAction],
  },
];
