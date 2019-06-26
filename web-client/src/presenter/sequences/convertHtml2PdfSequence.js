import { getPdfPreviewUrlAction } from '../actions/getPdfPreviewUrlAction';
import { setPdfPreviewUrlAction } from '../actions/setPdfPreviewUrlAction';

export const convertHtml2PdfSequence = [
  getPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
];
