import clearAlerts from '../actions/clearAlerts';
import getUser from '../actions/getUser';
import navigateToDashboard from '../actions/navigateToDashboard';
import setAlertError from '../actions/setAlertError';
import setFormSubmitting from '../actions/setFormSubmitting';
import setUser from '../actions/setUser';
import unsetFormSubmitting from '../actions/unsetFormSubmitting';

export default [
  setFormSubmitting,
  getUser,
  {
    error: [setAlertError],
    success: [setUser, clearAlerts, navigateToDashboard],
  },
  unsetFormSubmitting,
];
