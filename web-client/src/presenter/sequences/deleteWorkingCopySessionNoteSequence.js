import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { unsetSessionNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetSessionNoteFromTrialSessionWorkingCopyAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteWorkingCopySessionNoteSequence =
  showProgressSequenceDecorator([
    unsetSessionNoteFromTrialSessionWorkingCopyAction,
    updateTrialSessionWorkingCopyAction,
    clearModalAction,
    clearModalStateAction,
  ]);
