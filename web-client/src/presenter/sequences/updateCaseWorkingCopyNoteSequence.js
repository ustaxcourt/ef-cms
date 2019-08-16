import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { updateCaseNoteInTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/updateCaseNoteInTrialSessionWorkingCopyAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const updateCaseWorkingCopyNoteSequence = [
  updateNotePropsFromModalStateAction,
  updateCaseNoteInTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
];
