import clearAlerts from '../actions/clearAlertsAction';
import clearForm from '../actions/clearFormAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import updateCase from '../actions/updateCaseAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';

export default [
  clearAlerts,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [
      updateCase,
      {
        error: [setAlertError],
        success: [setCase, setAlertSuccess, clearForm],
      },
    ],
    error: [setValidationAlertErrorsAction],
  },
];
