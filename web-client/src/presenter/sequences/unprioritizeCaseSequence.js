import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unprioritizeCaseAction } from '../actions/CaseDetail/unprioritizeCaseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const unprioritizeCaseSequence = [
  setWaitingForResponseAction,
  unprioritizeCaseAction,
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
];
