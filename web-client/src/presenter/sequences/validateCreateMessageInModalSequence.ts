import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCreateMessageAction } from '../actions/validateCreateMessageAction';

export const validateCreateMessageInModalSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCreateMessageAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
