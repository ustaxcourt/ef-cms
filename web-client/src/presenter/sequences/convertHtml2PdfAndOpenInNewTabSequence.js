import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfFileAction } from '../actions/CourtIssuedOrder/getPdfFileAction';
import { openPdfPreviewInNewTabAction } from '../actions/openPdfPreviewInNewTabAction';
import { setMetadataAsPristineAction } from '../actions/setMetadataAsPristineAction';
import { setPdfFileAction } from '../actions/CourtIssuedOrder/setPdfFileAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const convertHtml2PdfAndOpenInNewTabSequence = showProgressSequenceDecorator(
  [
    createOrderAction,
    clearPdfPreviewUrlAction,
    getPdfFileAction,
    setPdfFileAction,
    setPdfPreviewUrlAction,
    setMetadataAsPristineAction,
    openPdfPreviewInNewTabAction,
  ],
);
