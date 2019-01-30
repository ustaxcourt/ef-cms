import clearAlerts from '../actions/clearAlertsAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';
import updateCase from '../actions/updateCaseAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [updateCase],
    error: [],
  },
];
