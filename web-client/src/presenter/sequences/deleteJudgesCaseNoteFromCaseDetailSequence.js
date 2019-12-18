import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteJudgesCaseNoteAction } from '../actions/TrialSession/deleteJudgesCaseNoteAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';

export const deleteJudgesCaseNoteFromCaseDetailSequence = [
  setWaitingForResponseAction,
  updateDeleteCaseNotePropsFromModalStateAction,
  deleteJudgesCaseNoteAction,
  setJudgesCaseNoteOnCaseDetailAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
