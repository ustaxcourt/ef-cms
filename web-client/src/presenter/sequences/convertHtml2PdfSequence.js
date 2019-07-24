import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFileAction } from '../actions/CourtIssuedOrder/getPdfFileAction';
import { set } from 'cerebral/factories';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { state } from 'cerebral';

export const convertHtml2PdfSequence = [
  createOrderAction,
  clearPdfPreviewUrlAction,
  getPdfFileAction,
  setPdfFileAction,
  setPdfPreviewUrlAction,
  set(state.screenMetadata.pristine, true),
];
