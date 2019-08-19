import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseNoteAction } from '../actions/Cases/validateCaseNoteAction';

export const validateCaseNoteSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseNoteAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
