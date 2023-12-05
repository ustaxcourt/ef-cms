import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCaseDetailsAction } from '../actions/validateCaseDetailsAction';

export const validateCaseDetailsSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCaseDetailsAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
