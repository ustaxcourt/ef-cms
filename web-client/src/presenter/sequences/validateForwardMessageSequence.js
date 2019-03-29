import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setForwardMessageValidationErrorsAction } from '../actions/setForwardMessageValidationErrorsAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';
import { shouldValidateWorkItemAction } from '../actions/ForwardForm/shouldValidateWorkItemAction';

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
