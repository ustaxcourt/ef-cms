import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { getTrialSessionPlanningReportAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionPlanningReportAction';
import { gotoTrialSessionsSequence } from '@web-client/presenter/sequences/gotoTrialSessionsSequence';
import { setTrialSessionPlanningReportAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionPlanningReportAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setupTrialSessionPlanningReportViewDataAction } from '@web-client/presenter/actions/setupTrialSessionPlanningReportViewDataAction';
import { setupTrialYearsAction } from '@web-client/presenter/actions/setupTrialYearsAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { validateTrialSessionPlanningAction } from '@web-client/presenter/actions/validateTrialSessionPlanningAction';

export const gotoTrialSessionPlanningReportViewSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    setupTrialYearsAction,
    validateTrialSessionPlanningAction,
    {
      error: [gotoTrialSessionsSequence],
      success: [
        setupTrialSessionPlanningReportViewDataAction,
        getTrialSessionPlanningReportAction,
        setTrialSessionPlanningReportAction,
        clearModalStateAction,
        setupCurrentPageAction('TrialSessionPlanningReportView'),
      ],
    },
  ]) as unknown as ({ term, year }: { term: string; year: string }) => void;
