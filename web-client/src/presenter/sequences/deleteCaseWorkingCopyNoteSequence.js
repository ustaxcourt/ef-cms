import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { unsetCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetCaseNoteFromTrialSessionWorkingCopyAction';
import { updateDeleteNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyNoteSequence = [
  updateDeleteNotePropsFromModalStateAction,
  unsetCaseNoteFromTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
];
