import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { createOrderAction } from '../actions/CourtIssuedOrder/createOrderAction';
import { getPdfUrlAction } from '../actions/CourtIssuedOrder/getPdfUrlAction';
import { setMetadataAsPristineAction } from '../actions/setMetadataAsPristineAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { shouldRefreshOrderPdfAction } from '../actions/CourtIssuedOrder/shouldRefreshOrderPdfAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const refreshPdfWhenSwitchingCreateOrderTabSequence = [
  shouldRefreshOrderPdfAction,
  {
    no: [],
    yes: showProgressSequenceDecorator([
      createOrderAction,
      clearPdfPreviewUrlAction,
      getPdfUrlAction,
      setPdfPreviewUrlAction,
      setMetadataAsPristineAction,
    ]),
  },
];
