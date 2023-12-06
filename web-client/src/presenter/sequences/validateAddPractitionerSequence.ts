import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateAddPractitionerAction } from '../actions/validateAddPractitionerAction';

export const validateAddPractitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateAddPractitionerAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
