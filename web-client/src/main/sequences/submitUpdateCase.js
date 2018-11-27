import clearAlerts from '../actions/clearAlerts';
import navigateToDashboard from '../actions/navigateToDashboard';
import setAlertError from '../actions/setAlertError';
import setAlertSuccess from '../actions/setAlertSuccess';
import updateCaseAction from '../actions/updateCase';

export default [
  clearAlerts,
  updateCaseAction,
  {
    error: [setAlertError],
    success: [setAlertSuccess, navigateToDashboard],
  },
];
