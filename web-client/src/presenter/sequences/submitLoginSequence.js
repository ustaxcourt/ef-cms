import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import getUser from '../actions/getUserAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import setUser from '../actions/setUserAction';
import setToken from '../actions/setTokenAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import navigateToPath from '../actions/navigateToPathAction';

export const submitLoginSequence = [
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
