import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateTrialSessionPlanningAction } from '../actions/validateTrialSessionPlanningAction';

export const runTrialSessionPlanningReportSequence = [
  startShowValidationAction,
  validateTrialSessionPlanningAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      // TODO: call some async action here in future task
      unsetWaitingForResponseAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
];
