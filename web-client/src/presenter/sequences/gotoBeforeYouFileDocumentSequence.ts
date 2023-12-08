import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setCaseAction } from '../actions/setCaseAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoBeforeYouFileDocument = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  getCaseAction,
  setCaseAction,
  setupCurrentPageAction('BeforeYouFileADocument'),
]);

export const gotoBeforeYouFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoBeforeYouFileDocument,
    unauthorized: [navigateToLoginSequence],
  },
];
