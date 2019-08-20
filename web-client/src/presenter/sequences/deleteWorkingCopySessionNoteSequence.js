import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { unsetSessionNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetSessionNoteFromTrialSessionWorkingCopyAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteWorkingCopySessionNoteSequence = [
  unsetSessionNoteFromTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
];
