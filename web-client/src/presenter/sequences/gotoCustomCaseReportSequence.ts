import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetCustomCaseInventoryReportStateAction } from '../actions/resetCustomCaseInventoryReportStateAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoCustomCaseReport = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  resetCustomCaseInventoryReportStateAction,
  setCurrentPageAction('CustomCaseReport'),
]);

export const gotoCustomCaseReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoCustomCaseReport],
    unauthorized: [redirectToCognitoAction],
  },
];
