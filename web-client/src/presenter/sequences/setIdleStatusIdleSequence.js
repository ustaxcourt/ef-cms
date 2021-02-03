import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConstants } from '../../getConstants';
import { getShouldSetAppTimeoutModalAction } from '../actions/getShouldSetAppTimeoutModalAction';
import { setIdleStatusFactoryAction } from '../actions/setIdleStatusFactoryAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';

export const setIdleStatusIdleSequence = [
  clearModalStateAction,
  // todo: don't trigger if already idleStatus=IDLE
  setIdleStatusFactoryAction(getConstants().IDLE_STATUS.IDLE),
  getShouldSetAppTimeoutModalAction,
  {
    no: [],
    yes: [
      setShowModalFactoryAction('AppTimeoutModal'),
      // tell every other tab that we should go idle (broadcast allIdle)
      // TODO set state.instances[currentInstance].showAppTimeoutModal = true instead of using setShowModalFactoryAction
      startDelayedLogoutAction,
    ],
  },
];
