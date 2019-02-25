import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFormCombinedWithCaseDetail } from '../actions/getFormCombinedWithCaseDetailAction';
import { updateCase } from '../actions/updateCaseAction';
import { validateCaseDetail } from '../actions/validateCaseDetailAction';

export default [
  clearAlertsAction,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [updateCase],
    error: [],
  },
];
