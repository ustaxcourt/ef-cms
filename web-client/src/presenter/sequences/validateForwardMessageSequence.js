import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setForwardMessageValidationErrorsAction } from '../actions/setForwardMessageValidationErrorsAction';
import { validateForwardMessageAction } from '../actions/validateForwardMessageAction';

export const validateForwardMessageSequence = [
  validateForwardMessageAction,
  {
    error: [setForwardMessageValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
