import { getConstants } from '../../getConstants';
import { setIdleStatusFactoryAction } from '../actions/setIdleStatusFactoryAction';

export const setIdleStatusActiveSequence = [
  setIdleStatusFactoryAction(getConstants().IDLE_STATUS.ACTIVE),
];
