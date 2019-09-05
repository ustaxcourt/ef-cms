import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const archiveDraftDocumentSequence = [
  setFormSubmittingAction,
  archiveDraftDocumentAction,
  refreshCaseAction,
  unsetFormSubmittingAction,
];
