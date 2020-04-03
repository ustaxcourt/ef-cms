import { validatePractitionerUserAction } from '../actions/validatePractitionerUserAction';

export const validatePractitionerUserSequence = [
  validatePractitionerUserAction,
  {
    error: [],
    success: [],
  },
];
