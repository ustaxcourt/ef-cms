import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoTrialSessionPlanningReport =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('TrialSessionPlanningReport'),
  ]);

export const gotoTrialSessionPlanningReportSequence = [
  gotoTrialSessionPlanningReport,
];
