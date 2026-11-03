import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getJudgesChambersSequence } from '@web-client/presenter/sequences/getJudgesChambersSequence';
import { setFormValueAction } from '../actions/setFormValueAction';
import { applyTrialSessionProceedingTypeRulesAction } from '../actions/TrialSession/applyTrialSessionProceedingTypeRulesAction';
import { getPreviousTrialSessionProceedingTypeAction } from '../actions/TrialSession/getPreviousTrialSessionProceedingTypeAction';

export const updateTrialSessionFormDataSequence = [
  getPreviousTrialSessionProceedingTypeAction,
  setFormValueAction,
  getJudgesChambersSequence,
  computeTrialSessionFormDataAction,
  applyTrialSessionProceedingTypeRulesAction,
];
