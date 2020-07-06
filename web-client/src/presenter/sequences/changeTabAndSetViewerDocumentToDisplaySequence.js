import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';

export const changeTabAndSetViewerDocumentToDisplaySequence = [
  setDefaultCaseDetailTabAction,
  setViewerDocumentToDisplayAction,
];
