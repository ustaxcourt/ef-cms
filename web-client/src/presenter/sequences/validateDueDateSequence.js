import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDueDateAction } from '../actions/ApplyStamp/validateDueDateAction';

export const validateDueDateSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateDueDateAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
