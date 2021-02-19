import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
// import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const validateTrialSessionNoteSequence = [
  validateNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
