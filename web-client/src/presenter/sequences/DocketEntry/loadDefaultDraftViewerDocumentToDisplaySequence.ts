import { getDefaultDraftViewerDocumentToDisplayAction } from '../../actions/getDefaultDraftViewerDocumentToDisplayAction';
import { setViewerDraftDocumentToDisplayAction } from '../../actions/setViewerDraftDocumentToDisplayAction';

export const loadDefaultDraftViewerDocumentToDisplaySequence = [
  getDefaultDraftViewerDocumentToDisplayAction,
  setViewerDraftDocumentToDisplayAction,
];
