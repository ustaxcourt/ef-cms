import clearAlerts from '../actions/clearAlertsAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';
import setAlertError from '../actions/setAlertErrorAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import updateCase from '../actions/updateCaseAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [
      updateCase,
      {
        error: [setAlertError],
        success: [],
      },
    ],
    error: [setValidationAlertErrorsAction],
  },
];
