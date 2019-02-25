import validateCaseDetail from '../actions/validateCaseDetailAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';

export const validateCaseDetailSequence = [
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  { success: [], error: [] }, // TODO: is there a way we don't need to put this here?
];
