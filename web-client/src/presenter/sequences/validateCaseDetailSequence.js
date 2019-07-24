import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

export const validateCaseDetailSequence = [
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  { error: [], success: [] },
];
