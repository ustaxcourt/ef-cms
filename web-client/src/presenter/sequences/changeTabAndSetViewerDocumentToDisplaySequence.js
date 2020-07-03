import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';

export const changeTabAndSetViewerDocumentToDisplaySequence = [
  setDefaultCaseDetailTabAction,
  setViewerDocumentToDisplayAction,
  setViewerDraftDocumentToDisplayAction,
];
