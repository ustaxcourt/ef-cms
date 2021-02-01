import { cancelDelayedLogoutAction } from '../actions/cancelDelayedLogoutAction';
import { getConstants } from '../../getConstants';
import { setIdleStatusFactoryAction } from '../actions/setIdleStatusFactoryAction';

export const setIdleStatusActiveSequence = [
  cancelDelayedLogoutAction,
  setIdleStatusFactoryAction(getConstants().IDLE_STATUS.ACTIVE),
];
