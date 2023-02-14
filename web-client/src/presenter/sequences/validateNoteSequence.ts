import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateNoteAction } from '../actions/validateNoteAction';

export const validateNoteSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateNoteAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
