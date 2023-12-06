import { getSetJudgesSequence } from './getSetJudgesSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { resetCustomCaseReportStateAction } from '../actions/resetCustomCaseReportStateAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoCustomCaseReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  resetCustomCaseReportStateAction,
  getSetJudgesSequence,
  setupCurrentPageAction('CustomCaseReport'),
]);

export const gotoCustomCaseReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [gotoCustomCaseReport],
    unauthorized: [redirectToCognitoAction],
  },
];
