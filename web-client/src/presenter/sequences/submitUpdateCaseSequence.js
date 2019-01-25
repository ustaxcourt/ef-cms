import clearAlerts from '../actions/clearAlertsAction';
import clearForm from '../actions/clearFormAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import updateCase from '../actions/updateCaseAction';

export default [
  clearAlerts,
  clearForm,
  updateCase,
  {
    error: [setAlertError],
    success: [setCase, setAlertSuccess, clearForm],
  },
];
