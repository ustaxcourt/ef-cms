import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePractitionerAction } from '../actions/validatePractitionerAction';

export const validateUpdatePractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
