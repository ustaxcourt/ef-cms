import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/CaseNotes/deleteCaseNoteAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteCaseNoteSequence = showProgressSequenceDecorator([
  deleteCaseNoteAction,
  getCaseAction,
  setCaseAction,
  clearModalAction,
  clearModalStateAction,
]);
