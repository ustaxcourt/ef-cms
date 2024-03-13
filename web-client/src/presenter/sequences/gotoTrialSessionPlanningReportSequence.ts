import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoTrialSessionPlanningReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('TrialSessionPlanningReport'),
  ]);
