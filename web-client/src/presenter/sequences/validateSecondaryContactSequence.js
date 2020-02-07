import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateSecondaryContactAction } from '../actions/validateSecondaryContactAction';

export const validateSecondaryContactSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [validateSecondaryContactAction, { error: [], success: [] }],
  },
];
