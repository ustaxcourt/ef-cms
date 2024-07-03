import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCourtOrderAction } from '../actions/CourtIssuedOrder/validateCourtOrderAction';

export const validateCourtOrderSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateCourtOrderAction,
      {
        error: [setValidationErrorsAction, setValidationAlertErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
] as unknown as () => void;
