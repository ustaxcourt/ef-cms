import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';

export const validateCaseDetailSequence = [
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  { error: [], success: [] },
];
