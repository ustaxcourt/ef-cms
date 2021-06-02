import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computePetitionDatesAction } from '../actions/computePetitionDatesAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionDetailsAction } from '../actions/validatePetitionDetailsAction';

export const validatePetitionDetailsSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computePetitionDatesAction,
      validatePetitionDetailsAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
