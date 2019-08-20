import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { unsetCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetCaseNoteFromTrialSessionWorkingCopyAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyNoteSequence = [
  updateDeleteCaseNotePropsFromModalStateAction,
  unsetCaseNoteFromTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
];
