import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitUpdateCaseModalAction } from '../actions/caseDetail/submitUpdateCaseModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const updateCaseDetailSequence = [
  setWaitingForResponseAction,
  submitUpdateCaseModalAction,
  unsetWaitingForResponseAction,
  clearModalAction,
  clearModalStateAction,
];
