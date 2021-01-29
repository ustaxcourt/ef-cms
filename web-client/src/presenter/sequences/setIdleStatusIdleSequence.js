import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConstants } from '../../getConstants';
import { getShouldSetAppTimeoutModalAction } from '../actions/getShouldSetAppTimeoutModalAction';
import { setIdleStatusFactoryAction } from '../actions/setIdleStatusFactoryAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';

export const setIdleStatusIdleSequence = [
  clearModalStateAction,
  setIdleStatusFactoryAction(getConstants().IDLE_STATUS.IDLE),
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
