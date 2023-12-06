import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateHearingNoteAction } from '../actions/validateHearingNoteAction';

export const validateTrialSessionHearingNoteSequence = [
  validateHearingNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
