import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { sequence } from 'cerebral';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';

export const setPdfPreviewUrlSequence = sequence([
  clearPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
]);
