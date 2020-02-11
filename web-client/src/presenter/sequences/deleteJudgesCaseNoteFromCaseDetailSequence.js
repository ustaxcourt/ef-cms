import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteJudgesCaseNoteAction } from '../actions/TrialSession/deleteJudgesCaseNoteAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateDeleteJudgesCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteJudgesCaseNotePropsFromModalStateAction';

export const deleteJudgesCaseNoteFromCaseDetailSequence = showProgressSequenceDecorator(
  [
    updateDeleteJudgesCaseNotePropsFromModalStateAction,
    deleteJudgesCaseNoteAction,
    setJudgesCaseNoteOnCaseDetailAction,
    clearModalAction,
    clearModalStateAction,
  ],
);
