import { shouldValidateAction } from '../actions/shouldValidateAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';

export const validatePetitionerSequence = [
  stopShowValidationAction,
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validatePetitionerAction,
      {
        error: [startShowValidationAction],
        success: [],
      },
    ],
  },
];
