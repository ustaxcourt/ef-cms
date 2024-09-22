import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { getJudgesChambersSequence } from '@web-client/presenter/sequences/getJudgesChambersSequence';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateTrialSessionFormDataSequence = [
  setFormValueAction,
  getJudgesChambersSequence,
  computeTrialSessionFormDataAction,
];
