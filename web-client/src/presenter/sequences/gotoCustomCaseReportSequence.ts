import { getSetJudgesSequence } from './getSetJudgesSequence';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
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
    unauthorized: [gotoLoginSequence],
  },
];
