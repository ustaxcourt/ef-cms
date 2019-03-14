import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';

export const validateInitialWorkItemMessageSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateInitialWorkItemMessageAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
