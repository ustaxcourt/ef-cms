import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { getDocketNumbersForConsolidatedServiceAction } from '../actions/getDocketNumbersForConsolidatedServiceAction';
import { serveCourtIssuedDocumentAction } from '../actions/serveCourtIssuedDocumentAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';

export const serveCourtIssuedDocumentSequence = [
  clearAlertsAction,
  clearPdfPreviewUrlAction,
  setWaitingForResponseAction,
  getDocketNumbersForConsolidatedServiceAction,
  serveCourtIssuedDocumentAction,
];
