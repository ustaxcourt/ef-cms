import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unblockCaseFromTrialAction } from '../actions/CaseDetail/unblockCaseFromTrialAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const unblockCaseFromTrialSequence = [
  setWaitingForResponseAction,
  unblockCaseFromTrialAction,
  unsetWaitingForResponseAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
];
