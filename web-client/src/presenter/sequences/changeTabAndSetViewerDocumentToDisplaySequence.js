import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';

export const changeTabAndSetViewerDocumentToDisplaySequence = [
  setDefaultCaseDetailTabAction,
  setIsPrimaryTabAction,
  setViewerDocumentToDisplayAction,
];
