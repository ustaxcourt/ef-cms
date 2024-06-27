import { getColdCaseReportAction } from '../actions/ColdCaseReport/getColdCaseReportAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoColdCaseReportSequence =
  startWebSocketConnectionSequenceDecorator([
    getColdCaseReportAction,
    setupCurrentPageAction('ColdCaseReport'),
  ]);
