import { computeTrialSessionWorkingCopyFilterValuesAction } from '../actions/TrialSessionWorkingCopy/computeTrialSessionWorkingCopyFilterValuesAction';
import { props, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const autoSaveTrialSessionWorkingCopySequence = [
  set(state.trialSessionWorkingCopy[props.key], props.value),
  computeTrialSessionWorkingCopyFilterValuesAction,
  updateTrialSessionWorkingCopyAction,
];
