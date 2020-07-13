import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCreateCaseMessageAction } from '../actions/validateCreateCaseMessageAction';

export const validateCreateCaseMessageInModalSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCreateCaseMessageAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
