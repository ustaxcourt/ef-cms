import { getBlockedCasesByTrialLocationAction } from '../actions/CaseDetail/getBlockedCasesByTrialLocationAction';
import { setBlockedCasesAction } from '../actions/CaseDetail/setBlockedCasesAction';

export const getBlockedCasesByTrialLocationSequence = [
  getBlockedCasesByTrialLocationAction,
  setBlockedCasesAction,
];
