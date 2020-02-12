import { clearModalAction } from '../actions/clearModalAction';
import { sealCaseAction } from '../actions/CaseDetail/sealCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const sealCaseSequence = [
  setWaitingForResponseAction,
  sealCaseAction,
  { error: [], success: [setAlertSuccessAction, setCaseAction] },
  unsetWaitingForResponseAction,
  clearModalAction,
];
