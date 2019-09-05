import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const archiveDraftDocumentSequence = [
  clearModalAction,
  setFormSubmittingAction,
  archiveDraftDocumentAction,
  refreshCaseAction,
  resetArchiveDraftDocumentAction,
  unsetFormSubmittingAction,
];
