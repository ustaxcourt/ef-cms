import { validateContactPrimaryAction } from '../actions/validateContactPrimaryAction';

export const validateContactPrimarySequence = [
  validateContactPrimaryAction,
  { error: [], success: [] },
];
