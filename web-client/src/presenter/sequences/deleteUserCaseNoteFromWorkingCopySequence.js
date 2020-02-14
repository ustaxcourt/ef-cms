import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteUserCaseNoteAction } from '../actions/TrialSession/deleteUserCaseNoteAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateCalendaredCaseUserNoteAction } from '../actions/TrialSessionWorkingCopy/updateCalendaredCaseUserNoteAction';
import { updateDeleteUserCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteUserCaseNotePropsFromModalStateAction';

export const deleteUserCaseNoteFromWorkingCopySequence = showProgressSequenceDecorator(
  [
    updateDeleteUserCaseNotePropsFromModalStateAction,
    deleteUserCaseNoteAction,
    getTrialSessionWorkingCopyAction,
    setTrialSessionWorkingCopyAction,
    updateCalendaredCaseUserNoteAction,
    clearModalAction,
    clearModalStateAction,
  ],
);
