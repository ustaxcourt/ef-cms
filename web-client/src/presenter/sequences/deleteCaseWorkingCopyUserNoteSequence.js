import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { unsetUserCaseNoteFromTrialSessionWorkingCopyAction } from '../actions/TrialSessionWorkingCopy/unsetUserCaseNoteFromTrialSessionWorkingCopyAction';
import { updateDeleteUserCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteUserCaseNotePropsFromModalStateAction';
import { updateTrialSessionWorkingCopyAction } from '../actions/TrialSession/updateTrialSessionWorkingCopyAction';

export const deleteCaseWorkingCopyUserNoteSequence = showProgressSequenceDecorator(
  [
    updateDeleteUserCaseNotePropsFromModalStateAction,
    unsetUserCaseNoteFromTrialSessionWorkingCopyAction,
    updateTrialSessionWorkingCopyAction,
    clearModalAction,
    clearModalStateAction,
  ],
);
