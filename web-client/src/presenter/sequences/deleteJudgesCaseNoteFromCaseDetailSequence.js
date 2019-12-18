import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/TrialSession/deleteCaseNoteAction';
import { setJudgesCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';

export const deleteJudgesCaseNoteFromCaseDetailSequence = [
  setWaitingForResponseAction,
  updateDeleteCaseNotePropsFromModalStateAction,
  deleteCaseNoteAction,
  setJudgesCaseNoteOnCaseDetailAction,
  clearModalAction,
  clearModalStateAction,
  unsetWaitingForResponseAction,
];
