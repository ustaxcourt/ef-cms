import clearAlerts from '../actions/clearAlertsAction';
import getUser from '../actions/getUserAction';
import decodeToken from '../actions/decodeTokenAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import setUser from '../actions/setUserAction';
import setToken from '../actions/setTokenAction';
import createToken from '../actions/createTokenAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import navigateToPath from '../actions/navigateToPathAction';

export default [
  setFormSubmitting,
  createToken,
  decodeToken,
  setToken,
  getUser,
  setUser,
  clearAlerts,
  navigateToPath,
  unsetFormSubmitting,
];
