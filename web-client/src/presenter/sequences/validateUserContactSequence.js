import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateUserContactAction } from '../actions/validateUserContactAction';

export const validateUserContactSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateUserContactAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
