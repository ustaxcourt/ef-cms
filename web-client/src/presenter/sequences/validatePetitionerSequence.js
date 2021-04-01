import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';

export const validatePetitionerSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [validatePetitionerAction, { error: [], success: [] }],
  },
];
