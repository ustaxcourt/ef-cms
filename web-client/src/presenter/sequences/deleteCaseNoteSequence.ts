import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCaseNoteAction } from '../actions/CaseNotes/deleteCaseNoteAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteCaseNoteSequence = showProgressSequenceDecorator([
  deleteCaseNoteAction,
  refreshCaseMetadataAction,
  clearModalAction,
  clearModalStateAction,
]);
