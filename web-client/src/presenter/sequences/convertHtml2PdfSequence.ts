import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getPdfFromUrlAction } from '../actions/CourtIssuedOrder/getPdfFromUrlAction';
import { getPdfUrlAction } from '../actions/CourtIssuedOrder/getPdfUrlAction';
import { getStatusReportOrderPdfUrlAction } from '../actions/StatusReportOrder/getStatusReportOrderPdfUrlAction';
import { isStatusReportOrderAction } from '../actions/StatusReportOrder/isStatusReportOrderAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setMetadataAsPristineAction } from '../actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const convertHtml2PdfSequence = showProgressSequenceDecorator([
  createOrderAction,
  clearPdfPreviewUrlAction,
  getCaseAction,
  setCaseAction,
  isStatusReportOrderAction,
  {
    isNotStatusReportOrder: [getPdfUrlAction],
    isStatusReportOrder: [getStatusReportOrderPdfUrlAction],
  },
  getPdfFromUrlAction,
  setPdfFileAction,
  setPdfPreviewUrlAction,
  setMetadataAsPristineAction,
]);
