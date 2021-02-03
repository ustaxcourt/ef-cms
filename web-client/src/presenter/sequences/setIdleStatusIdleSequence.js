import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getConstants } from '../../getConstants';
import { getShouldSetAppTimeoutModalAction } from '../actions/getShouldSetAppTimeoutModalAction';
import { setIdleStatusFactoryAction } from '../actions/setIdleStatusFactoryAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { startDelayedLogoutAction } from '../actions/startDelayedLogoutAction';

export const setIdleStatusIdleSequence = [
  clearModalStateAction,
  setShowModalFactoryAction('AppTimeoutModal'),
  startDelayedLogoutAction,
  // clearModalStateAction,
  // setIdleStatusFactoryAction(getConstants().IDLE_STATUS.IDLE),
  // getShouldSetAppTimeoutModalAction,
  // {
  //   no: [],
  //   yes: [
  //     // TODO 7501 maybe publish event saying the delayed logout has started
  //     setShowModalFactoryAction('AppTimeoutModal'),
  //     // TODO 7501 - set state.instances[currentInstance].showAppTimeoutModal = true instead of using setShowModalFactoryAction
  //     startDelayedLogoutAction,
  //   ],
  // },
];
