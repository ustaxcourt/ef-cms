import { getCaseAction } from '../actions/getCaseAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseIdFromSearchAction } from '../actions/setCaseIdFromSearchAction';

export const submitCaseSearchSequence = [
  setCaseIdFromSearchAction,
  getCaseAction,
  {
    error: [],
    success: [navigateToCaseDetailAction],
  },
];
