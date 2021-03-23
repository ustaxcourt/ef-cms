import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateCalendarNoteAction } from '../actions/validateCalendarNoteAction';

export const validateTrialSessionNoteSequence = [
  validateCalendarNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
