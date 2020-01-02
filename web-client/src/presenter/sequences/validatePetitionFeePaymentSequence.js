import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validatePetitionFeePaymentAction } from '../actions/validatePetitionFeePaymentAction';

export const validatePetitionFeePaymentSequence = [
  validatePetitionFeePaymentAction,
  {
    error: [setValidationErrorsAction],
    success: [clearAlertsAction],
  },
];
