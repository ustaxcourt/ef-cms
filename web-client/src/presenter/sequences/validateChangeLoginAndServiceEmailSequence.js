import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateChangeLoginAndServiceEmailAction } from '../actions/validateChangeLoginAndServiceEmailAction';

export const validateChangeLoginAndServiceEmailSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateChangeLoginAndServiceEmailAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
