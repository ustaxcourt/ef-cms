import { computeTrialSessionWorkingCopyFilterValuesAction } from '../actions/TrialSessionWorkingCopy/computeTrialSessionWorkingCopyFilterValuesAction';
import { setTrialSessionWorkingCopyKeyAction } from '../actions/setTrialSessionWorkingCopyKeyAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const autoSaveTrialSessionWorkingCopySequence = [
  setTrialSessionWorkingCopyKeyAction,
  computeTrialSessionWorkingCopyFilterValuesAction,
  updateTrialSessionWorkingCopyAction,
];
