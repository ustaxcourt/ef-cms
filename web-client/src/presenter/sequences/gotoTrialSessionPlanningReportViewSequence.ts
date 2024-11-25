import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupTrialSessionPlanningReportViewDataAction } from '@web-client/presenter/actions/setupTrialSessionPlanningReportViewDataAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoTrialSessionPlanningReportViewSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    setupTrialSessionPlanningReportViewDataAction,
    setupCurrentPageAction('TrialSessionPlanningReportView'),
  ]);
