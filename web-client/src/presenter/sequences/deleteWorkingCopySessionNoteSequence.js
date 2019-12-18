import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetSessionNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetSessionNoteFromTrialSessionWorkingCopyAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteWorkingCopySessionNoteSequence = [
  setWaitingForResponseAction,
  unsetSessionNoteFromTrialSessionWorkingCopyAction,
  updateTrialSessionWorkingCopyAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
