import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const archiveDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  archiveDraftDocumentAction,
  refreshCaseAction,
  resetArchiveDraftDocumentAction,
  navigateToCaseDetailAction,
]);
