import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createTokenAction } from '../actions/createTokenAction';
import { decodeTokenAction } from '../actions/decodeTokenAction';
import { getUserAction } from '../actions/getUserAction';
import { navigateToPathAction } from '../actions/navigateToPathAction';
import { setTokenAction } from '../actions/setTokenAction';
import { setUserAction } from '../actions/setUserAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const submitLoginSequence = [
  setWaitingForResponseAction,
  createTokenAction,
  decodeTokenAction,
  setTokenAction,
  getUserAction,
  setUserAction,
  clearAlertsAction,
  navigateToPathAction,
  unsetWaitingForResponseAction,
];
