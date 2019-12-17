import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePrimaryContactAction } from '../actions/validatePrimaryContactAction';

export const validatePrimaryContactSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [validatePrimaryContactAction, { error: [], success: [] }],
  },
];
