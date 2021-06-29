import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteUserCaseNoteAction } from '../actions/TrialSession/deleteUserCaseNoteAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateCalendaredCaseUserNoteAction } from '../actions/TrialSessionWorkingCopy/updateCalendaredCaseUserNoteAction';
import { updateDeleteUserCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteUserCaseNotePropsFromModalStateAction';

export const deleteUserCaseNoteFromWorkingCopySequence =
  showProgressSequenceDecorator([
    updateDeleteUserCaseNotePropsFromModalStateAction,
    deleteUserCaseNoteAction,
    updateCalendaredCaseUserNoteAction,
    clearModalAction,
    clearModalStateAction,
  ]);
