import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateContactPrimaryAction } from '../actions/validateContactPrimaryAction';

export const validateContactPrimarySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [validateContactPrimaryAction, { error: [], success: [] }],
  },
];
