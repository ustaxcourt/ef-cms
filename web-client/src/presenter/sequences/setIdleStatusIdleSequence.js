import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getShouldSetAppTimeoutModalAction } from '../actions/getShouldSetAppTimeoutModalAction';
import { setIdleStatusIdleAction } from '../actions/setIdleStatusIdleAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';

export const setIdleStatusIdleSequence = [
  clearModalStateAction,
  setIdleStatusIdleAction,
  getShouldSetAppTimeoutModalAction,
  {
    no: [],
    yes: [
      setShowModalFactoryAction('AppTimeoutModal'),
      // TODO set state.instances[currentInstance].showAppTimeoutModal = true instead of using setShowModalFactoryAction
      startDelayedLogoutAction,
    ],
  },
];
