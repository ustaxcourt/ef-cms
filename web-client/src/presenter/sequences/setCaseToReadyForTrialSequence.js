import { setCaseToReadyForTrialAction } from '../actions/setCaseToReadyForTrialAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const setCaseToReadyForTrialSequence = [
  setWaitingForResponseAction,
  setCaseToReadyForTrialAction,
  unsetWaitingForResponseAction,
];
