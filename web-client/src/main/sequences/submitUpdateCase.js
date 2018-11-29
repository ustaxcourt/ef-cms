import clearAlerts from '../actions/clearAlerts';
import clearForm from '../actions/clearForm';
import setAlertError from '../actions/setAlertError';
import setAlertSuccess from '../actions/setAlertSuccess';
import setCase from '../actions/setCase';
import updateCaseAction from '../actions/updateCase';

export default [
  clearAlerts,
  clearForm,
  updateCaseAction,
  {
    error: [setAlertError],
    success: [setCase, setAlertSuccess, clearForm],
  },
];
