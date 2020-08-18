import { getMostRecentMessageInThreadAction } from '../actions/getMostRecentMessageInThreadAction';
import { setDefaultCaseDetailTabAction } from '../actions/setDefaultCaseDetailTabAction';
import { setIsPrimaryTabAction } from '../actions/setIsPrimaryTabAction';
import { setViewerDocumentToDisplayAction } from '../actions/setViewerDocumentToDisplayAction';

export const changeTabAndSetViewerDocumentToDisplaySequence = [
  setDefaultCaseDetailTabAction,
  setIsPrimaryTabAction,
  getMostRecentMessageInThreadAction,
  setViewerDocumentToDisplayAction,
];
