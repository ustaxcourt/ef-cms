import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { unblockFromTrialAction } from '../actions/CaseDetail/unblockFromTrialAction';

export const unblockFromTrialSequence = [
  unblockFromTrialAction,
  setAlertSuccessAction,
  clearModalAction,
  setCaseAction,
];
