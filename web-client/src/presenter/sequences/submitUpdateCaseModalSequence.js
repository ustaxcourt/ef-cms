import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitUpdateCaseModalAction } from '../actions/CaseDetail/submitUpdateCaseModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const submitUpdateCaseModalSequence = [
  setWaitingForResponseAction,
  submitUpdateCaseModalAction,
  setCaseAction,
  unsetWaitingForResponseAction,
  clearModalAction,
  clearModalStateAction,
];
