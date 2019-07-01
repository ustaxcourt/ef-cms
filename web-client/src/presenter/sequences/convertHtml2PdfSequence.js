import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfPreviewUrlAction } from '../actions/getPdfPreviewUrlAction';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../actions/setPdfPreviewUrlAction';

export const convertHtml2PdfSequence = [
  createOrderAction,
  getPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
  setPdfFileAction,
];
