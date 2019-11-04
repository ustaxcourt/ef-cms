import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { runTrialSessionPlanningReportAction } from '../actions/TrialSession/runTrialSessionPlanningReportAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateTrialSessionPlanningAction } from '../actions/validateTrialSessionPlanningAction';

export const runTrialSessionPlanningReportSequence = [
  startShowValidationAction,
  validateTrialSessionPlanningAction,
  {
    error: [setValidationErrorsAction],
    success: [
      clearModalAction,
      setWaitingForResponseAction,
      runTrialSessionPlanningReportAction,
      clearModalStateAction,
      ...setPdfPreviewUrlSequence,
      setCurrentPageAction('TrialSessionPlanningReport'),
      unsetWaitingForResponseAction,
      setAlertSuccessAction,
      stopShowValidationAction,
    ],
  },
];
