import { createAttorneyUserAction } from '../actions/createAttorneyUserAction';

export const submitCreateAttorneyUserSequence = [
  createAttorneyUserAction,
  {
    error: [],
    success: [],
  },
];
