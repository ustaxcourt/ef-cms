import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getDefaultDraftViewerDocumentToDisplayAction } from '../actions/getDefaultDraftViewerDocumentToDisplayAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const archiveDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  archiveDraftDocumentAction,
  setCaseAction,
  resetArchiveDraftDocumentAction,
  getDefaultDraftViewerDocumentToDisplayAction,
  setViewerDraftDocumentToDisplayAction,
  navigateToCaseDetailAction,
]);
