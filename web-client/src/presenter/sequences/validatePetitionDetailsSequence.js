import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionDetailsAction } from '../actions/validatePetitionDetailsAction';

export const validatePetitionDetailsSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionDetailsAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
