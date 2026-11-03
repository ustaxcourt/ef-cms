import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getJudgesChambersSequence } from '@web-client/presenter/sequences/getJudgesChambersSequence';
import { setFormValueAction } from '../actions/setFormValueAction';
import { applyTrialSessionProceedingTypeRulesAction } from '../actions/TrialSession/applyTrialSessionProceedingTypeRulesAction';

export const updateTrialSessionFormDataSequence = [
  setFormValueAction,
  getJudgesChambersSequence,
  computeTrialSessionFormDataAction,
  applyTrialSessionProceedingTypeRulesAction,
];
