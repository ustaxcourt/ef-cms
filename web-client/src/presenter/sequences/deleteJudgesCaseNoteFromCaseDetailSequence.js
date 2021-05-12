import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteUserCaseNoteAction } from '../actions/TrialSession/deleteUserCaseNoteAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateDeleteUserCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteUserCaseNotePropsFromModalStateAction';

export const deleteJudgesCaseNoteFromCaseDetailSequence =
  showProgressSequenceDecorator([
    updateDeleteUserCaseNotePropsFromModalStateAction,
    deleteUserCaseNoteAction,
    setJudgesCaseNoteOnCaseDetailAction,
    clearModalAction,
    clearModalStateAction,
  ]);
