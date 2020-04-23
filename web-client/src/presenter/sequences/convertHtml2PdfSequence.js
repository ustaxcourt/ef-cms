import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFileAction } from '../actions/CourtIssuedOrder/getPdfFileAction';
import { setMetadataAsPristineAction } from '../actions/setMetadataAsPristineAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const convertHtml2PdfSequence = showProgressSequenceDecorator([
  createOrderAction,
  clearPdfPreviewUrlAction,
  getPdfFileAction,
  setPdfPreviewUrlAction,
  setMetadataAsPristineAction,
]);
