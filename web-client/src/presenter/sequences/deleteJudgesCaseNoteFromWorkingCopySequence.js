import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteJudgesCaseNoteAction } from '../actions/TrialSession/deleteJudgesCaseNoteAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateCalendaredCaseJudgesNoteAction } from '../actions/TrialSessionWorkingCopy/updateCalendaredCaseJudgesNoteAction';
import { updateDeleteJudgesCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteJudgesCaseNotePropsFromModalStateAction';

export const deleteJudgesCaseNoteFromWorkingCopySequence = showProgressSequenceDecorator(
  [
    updateDeleteJudgesCaseNotePropsFromModalStateAction,
    deleteJudgesCaseNoteAction,
    getTrialSessionWorkingCopyAction,
    setTrialSessionWorkingCopyAction,
    updateCalendaredCaseJudgesNoteAction,
    clearModalAction,
    clearModalStateAction,
  ],
);
