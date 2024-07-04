import { clearPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFromUrlAction } from '../../actions/CourtIssuedOrder/getPdfFromUrlAction';
import { getPdfUrlAction } from '../../actions/CourtIssuedOrder/getPdfUrlAction';
import { prepareStatusReportOrderResponseAction } from '../../actions/StatusReportOrderResponse/prepareStatusReportOrderResponseAction';
import { setMetadataAsPristineAction } from '../../actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '../../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const statusReportOrderResponsePdfPreviewSequence =
  showProgressSequenceDecorator([
    prepareStatusReportOrderResponseAction,
    createOrderAction,
    clearPdfPreviewUrlAction,
    getPdfUrlAction,
    getPdfFromUrlAction,
    setPdfFileAction,
    setPdfPreviewUrlAction,
    setMetadataAsPristineAction,
  ]);
