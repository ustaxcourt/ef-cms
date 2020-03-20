import { validateAttorneyUserAction } from '../actions/validateAttorneyUserAction';

export const validateAttorneyUserSequence = [
  validateAttorneyUserAction,
  {
    error: [],
    success: [],
  },
];
