import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/TrialSession/deleteCaseNoteAction';
import { setCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setCaseNoteOnCaseDetailAction';
import { updateDeleteCaseNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateDeleteCaseNotePropsFromModalStateAction';

export const deleteCaseNoteFromCaseDetailSequence = [
  updateDeleteCaseNotePropsFromModalStateAction,
  deleteCaseNoteAction,
  setCaseNoteOnCaseDetailAction,
  clearModalAction,
  clearModalStateAction,
];
