import clearAlerts from '../actions/clearAlerts';
import getUser from '../actions/getUser';
import setAlertError from '../actions/setAlertError';
import setFormSubmitting from '../actions/setFormSubmitting';
import setUser from '../actions/setUser';
import unsetFormSubmitting from '../actions/unsetFormSubmitting';
import navigateToPath from '../actions/navigateToPath';

export default [
  setFormSubmitting,
  getUser,
  {
    error: [setAlertError],
    success: [setUser, clearAlerts, navigateToPath],
  },
  unsetFormSubmitting,
];
