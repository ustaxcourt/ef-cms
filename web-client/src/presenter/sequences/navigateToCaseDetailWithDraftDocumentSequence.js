import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';

export const navigateToCaseDetailWithDraftDocumentSequence = [
  navigateToDraftDocumentsAction,
  setViewerDraftDocumentToDisplayAction,
];
