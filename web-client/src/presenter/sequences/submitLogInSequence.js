import clearAlerts from '../actions/clearAlertsAction';
import getUser from '../actions/getUserAction';
import setAlertError from '../actions/setAlertErrorAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import setUser from '../actions/setUserAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import navigateToPath from '../actions/navigateToPathAction';

export default [
  setFormSubmitting,
  getUser,
  {
    error: [setAlertError],
    success: [setUser, clearAlerts, navigateToPath],
  },
  unsetFormSubmitting,
];
