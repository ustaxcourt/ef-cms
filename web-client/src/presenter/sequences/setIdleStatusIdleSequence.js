import { set } from 'cerebral/factories';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';
import { state } from 'cerebral';

export const setIdleStatusIdleSequence = [
  startDelayedLogoutAction,
  set(state.showModal, 'AppTimeoutModal'),
];
