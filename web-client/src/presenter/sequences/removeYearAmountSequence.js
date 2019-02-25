import { removeYearAmountAction } from '../actions/removeYearAmountAction';
import { updateCaseAction } from '../actions/updateCaseAction';

export const removeYearAmountSequence = [
  removeYearAmountAction,
  updateCaseAction,
];
