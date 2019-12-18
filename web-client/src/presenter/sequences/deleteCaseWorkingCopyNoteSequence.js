import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetCaseNoteFromTrialSessionWorkingCopyAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyNoteSequence = [
  setWaitingForResponseAction,
  updateDeleteCaseNotePropsFromModalStateAction,
  unsetCaseNoteFromTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
