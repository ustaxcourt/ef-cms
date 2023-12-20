import { getSetJudgesSequence } from './getSetJudgesSequence';
import { resetCustomCaseReportStateAction } from '../actions/resetCustomCaseReportStateAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoCustomCaseReport = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  resetCustomCaseReportStateAction,
  getSetJudgesSequence,
  setupCurrentPageAction('CustomCaseReport'),
]);

export const gotoCustomCaseReportSequence = [gotoCustomCaseReport];
