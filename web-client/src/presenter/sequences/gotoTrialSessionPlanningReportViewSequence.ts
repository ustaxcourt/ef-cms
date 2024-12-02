import { getTrialSessionPlanningReportAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionPlanningReportAction';
import { setTrialSessionPlanningReportAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionPlanningReportAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupTrialSessionPlanningReportViewDataAction } from '@web-client/presenter/actions/setupTrialSessionPlanningReportViewDataAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoTrialSessionPlanningReportViewSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    setupTrialSessionPlanningReportViewDataAction,
    getTrialSessionPlanningReportAction,
    setTrialSessionPlanningReportAction,
    setupCurrentPageAction('TrialSessionPlanningReportView'),
  ]);
