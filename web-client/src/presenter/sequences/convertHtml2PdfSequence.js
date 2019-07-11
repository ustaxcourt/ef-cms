import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFileAction } from '../actions/CourtIssuedOrder/getPdfFileAction';
import { set } from 'cerebral/factories';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { state } from 'cerebral';

export const convertHtml2PdfSequence = [
  createOrderAction,
  getPdfFileAction,
  setPdfFileAction,
  set(state.screenMetadata.pristine, true),
];
