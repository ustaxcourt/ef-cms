import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/CaseNotes/deleteCaseNoteAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteCaseNoteSequence = showProgressSequenceDecorator([
  deleteCaseNoteAction,
  setCaseAction,
  clearModalAction,
  clearModalStateAction,
]);
