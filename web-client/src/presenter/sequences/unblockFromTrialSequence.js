import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unblockFromTrialAction } from '../actions/CaseDetail/unblockFromTrialAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const unblockFromTrialSequence = [
  setWaitingForResponseAction,
  unblockFromTrialAction,
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
];
