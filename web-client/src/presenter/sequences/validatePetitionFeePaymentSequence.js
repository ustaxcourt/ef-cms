import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionFeePaymentAction } from '../actions/validatePetitionFeePaymentAction';

export const validatePetitionFeePaymentSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionFeePaymentAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
