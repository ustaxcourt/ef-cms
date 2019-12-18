import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const getBlockedCasesByTrialLocationSequence = [
  setFormValueAction,
  setWaitingForResponseAction,
  getBlockedCasesByTrialLocationAction,
  setBlockedCasesAction,
  unsetWaitingForResponseAction,
];
