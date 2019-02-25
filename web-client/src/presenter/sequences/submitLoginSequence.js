import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getUserAction } from '../actions/getUserAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setUserAction } from '../actions/setUserAction';
import { setTokenAction } from '../actions/setTokenAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';

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
