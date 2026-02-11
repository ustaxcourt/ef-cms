import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/CaseNotes/deleteCaseNoteAction';
import { setCaseNoteOnCaseDetailAction } from '../actions/CaseNotes/setCaseNoteOnCaseDetailAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteCaseNoteSequence = showProgressSequenceDecorator([
  deleteCaseNoteAction,
  setCaseNoteOnCaseDetailAction,
  clearModalAction,
  clearModalStateAction,
]);
