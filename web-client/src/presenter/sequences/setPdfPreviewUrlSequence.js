import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';

export const setPdfPreviewUrlSequence = [
  clearPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
];
