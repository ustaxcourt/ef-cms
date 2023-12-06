import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const validateCaseDetailSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseDetailAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
