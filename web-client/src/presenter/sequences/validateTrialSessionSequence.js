import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateTrialSessionAction } from '../actions/TrialSession/validateTrialSessionAction';

export const validateTrialSessionSequence = [
  validateTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
