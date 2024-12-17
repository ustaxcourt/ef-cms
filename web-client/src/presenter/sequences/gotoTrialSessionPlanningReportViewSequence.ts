import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
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
    clearModalStateAction,
    setupCurrentPageAction('TrialSessionPlanningReportView'),
  ]) as unknown as ({
    trialTerm,
    trialYear,
  }: {
    trialTerm: string;
    trialYear: number;
  }) => void;
