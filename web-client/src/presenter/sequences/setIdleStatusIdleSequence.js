import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';

export const setIdleStatusIdleSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('AppTimeoutModal'),
  startDelayedLogoutAction,
];
