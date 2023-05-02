import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoCustomCaseReport = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  setCurrentPageAction('CustomCaseReport'),
]);

export const gotoCustomCaseReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoCustomCaseReport],
    unauthorized: [redirectToCognitoAction],
  },
];
