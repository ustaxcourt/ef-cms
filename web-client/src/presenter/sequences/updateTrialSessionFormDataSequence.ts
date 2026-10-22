import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getJudgesChambersSequence } from '@web-client/presenter/sequences/getJudgesChambersSequence';
import { setFormValueAction } from '../actions/setFormValueAction';
import { normalizeTrialSessionProceedingTypeAction } from '../actions/TrialSession/normalizeTrialSessionProceedingTypeAction';

export const updateTrialSessionFormDataSequence = [
  setFormValueAction,
  getJudgesChambersSequence,
  computeTrialSessionFormDataAction,
  normalizeTrialSessionProceedingTypeAction,
];
