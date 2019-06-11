import { computeTrialSessionFormDataAction } from '../actions/TrialSession/computeTrialSessionFormDataAction';
import { updateFormValueWithoutEmptyStringAction } from '../actions/updateFormValueWithoutEmptyStringAction';

export const updateTrialSessionFormDataSequence = [
  updateFormValueWithoutEmptyStringAction,
  computeTrialSessionFormDataAction,
];
