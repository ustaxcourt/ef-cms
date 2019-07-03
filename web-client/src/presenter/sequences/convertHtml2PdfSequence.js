import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/getPdfPreviewUrlAction';
import { set } from 'cerebral/factories';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { state } from 'cerebral';

export const convertHtml2PdfSequence = [
  createOrderAction,
  getPdfPreviewUrlAction,
  setPdfPreviewUrlAction,
  setPdfFileAction,
  set(state.screenMetadata.pristine, true),
];
