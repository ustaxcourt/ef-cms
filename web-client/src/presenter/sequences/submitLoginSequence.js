import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const submitLoginSequence = [
  setFormSubmittingAction,
  createTokenAction,
  decodeTokenAction,
  setTokenAction,
  getUserAction,
  setUserAction,
  clearAlertsAction,
  navigateToPathAction,
  unsetFormSubmittingAction,
];
