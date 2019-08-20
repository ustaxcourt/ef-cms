import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/TrialSession/deleteCaseNoteAction';
import { unsetCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetCaseNoteFromTrialSessionWorkingCopyAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyNoteSequence = [
  updateDeleteCaseNotePropsFromModalStateAction,
  deleteCaseNoteAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
];
