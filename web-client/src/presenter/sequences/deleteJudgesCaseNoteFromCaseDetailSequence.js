import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteJudgesCaseNoteAction } from '../actions/TrialSession/deleteJudgesCaseNoteAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateDeleteJudgesCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteJudgesCaseNotePropsFromModalStateAction';

export const deleteJudgesCaseNoteFromCaseDetailSequence = [
  setWaitingForResponseAction,
  updateDeleteJudgesCaseNotePropsFromModalStateAction,
  deleteJudgesCaseNoteAction,
  setJudgesCaseNoteOnCaseDetailAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
