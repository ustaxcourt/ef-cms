import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateOrderWithoutBodyAction } from '../actions/CourtIssuedOrder/validateOrderWithoutBodyAction';

export const validateOrderWithoutBodySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateOrderWithoutBodyAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
