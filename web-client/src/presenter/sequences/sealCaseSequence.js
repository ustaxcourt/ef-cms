import { clearModalAction } from '../actions/clearModalAction';
import { sealCaseAction } from '../actions/CaseDetail/sealCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const sealCaseSequence = [
  setWaitingForResponseAction,
  sealCaseAction,
  { error: [], success: [setCaseAction] },
  unsetWaitingForResponseAction,
  clearModalAction,
];
