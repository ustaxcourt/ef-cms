import { getDefaultDocketViewerDocumentToDisplayAction } from '../../actions/getDefaultDocketViewerDocumentToDisplayAction';
import { setViewerDocumentToDisplayAction } from '../../actions/setViewerDocumentToDisplayAction';

export const loadDefaultDocketViewerDocumentToDisplaySequence = [
  getDefaultDocketViewerDocumentToDisplayAction,
  setViewerDocumentToDisplayAction,
];
