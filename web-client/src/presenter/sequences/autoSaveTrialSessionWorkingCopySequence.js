import { computeTrialSessionWorkingCopyFilterValuesAction } from '../actions/TrialSessionWorkingCopy/computeTrialSessionWorkingCopyFilterValuesAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';
import { updateTrialSessionWorkingCopyValueWithoutEmptyStringAction } from '../actions/TrialSessionWorkingCopy/updateTrialSessionWorkingCopyValueWithoutEmptyStringAction';

export const autoSaveTrialSessionWorkingCopySequence = [
  updateTrialSessionWorkingCopyValueWithoutEmptyStringAction,
  computeTrialSessionWorkingCopyFilterValuesAction,
  updateTrialSessionWorkingCopyAction,
];
