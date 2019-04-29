import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';
import { state } from 'cerebral';

export const setIdleStatusIdleSequence = [
  clearModalStateAction,
  set(state.showModal, 'AppTimeoutModal'),
  startDelayedLogoutAction,
];
