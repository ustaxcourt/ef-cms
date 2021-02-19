import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateTrialSessionNoteAction } from '../actions/TrialSession/validateTrialSessionNoteAction';

export const validateTrialSessionNoteSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateTrialSessionNoteAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
