import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setForwardMessageValidationErrorsAction } from '../actions/setForwardMessageValidationErrorsAction';
import { shouldValidateWorkItemAction } from '../actions/ForwardForm/shouldValidateWorkItemAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';

export const validateForwardMessageSequence = [
  shouldValidateWorkItemAction,
  {
    ignore: [],
    validate: [
      validateForwardMessageAction,
      {
        error: [setForwardMessageValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
