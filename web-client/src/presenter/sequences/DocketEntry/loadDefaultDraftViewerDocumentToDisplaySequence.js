import { getDefaultDraftViewerDocumentToDisplayAction } from '../../actions/getDefaultDraftViewerDocumentToDisplayAction';
import { setViewerDocumentToDisplayAction } from '../../actions/setViewerDocumentToDisplayAction';

export const loadDefaultDraftViewerDocumentToDisplaySequence = [
  getDefaultDraftViewerDocumentToDisplayAction,
  setViewerDocumentToDisplayAction,
];
