import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import getUser from '../actions/getUserAction';
import navigateToPath from '../actions/navigateToPathAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import setToken from '../actions/setTokenAction';
import setUser from '../actions/setUserAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  setFormSubmitting,
  createTokenAction,
  decodeTokenAction,
  setToken,
  getUser,
  setUser,
  clearAlertsAction,
  navigateToPath,
  unsetFormSubmitting,
];
