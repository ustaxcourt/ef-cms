import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const removeDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  archiveDraftDocumentAction,
  setCaseAction,
  resetArchiveDraftDocumentAction,
  navigateToCaseDetailAction,
]);
