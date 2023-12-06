import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateTrialSessionFormDataSequence = [
  setFormValueAction,
  computeTrialSessionFormDataAction,
];
