import clearAlerts from '../actions/clearAlertsAction';
import getUser from '../actions/getUserAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import setUser from '../actions/setUserAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import navigateToPath from '../actions/navigateToPathAction';

export default [
  setFormSubmitting,
  getUser,
  setUser,
  clearAlerts,
  navigateToPath,
  unsetFormSubmitting,
];
