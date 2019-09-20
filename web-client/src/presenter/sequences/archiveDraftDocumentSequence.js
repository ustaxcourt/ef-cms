import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const archiveDraftDocumentSequence = [
  clearModalAction,
  setWaitingForResponseAction,
  archiveDraftDocumentAction,
  refreshCaseAction,
  resetArchiveDraftDocumentAction,
  unsetWaitingForResponseAction,
  navigateToCaseDetailAction,
];
