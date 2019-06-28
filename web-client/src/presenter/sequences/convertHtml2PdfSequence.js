import { createOrderAction } from '../actions/createOrderAction';
import { getPdfPreviewUrlAction } from '../actions/getPdfPreviewUrlAction';
import { setPdfPreviewUrlAction } from '../actions/setPdfPreviewUrlAction';

export const convertHtml2PdfSequence = [
  createOrderAction,
  getPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
];
