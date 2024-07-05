import { clearPdfPreviewUrlAction } from '../../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFromUrlAction } from '../../actions/CourtIssuedOrder/getPdfFromUrlAction';
import { getStatusReportOrderResponsePdfUrlAction } from '../../actions/StatusReportOrderResponse/getStatusReportOrderResponsePdfUrlAction';
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
    getStatusReportOrderResponsePdfUrlAction,
    getPdfFromUrlAction,
    setPdfFileAction,
    setPdfPreviewUrlAction,
    setMetadataAsPristineAction,
  ]) as unknown as () => void;
