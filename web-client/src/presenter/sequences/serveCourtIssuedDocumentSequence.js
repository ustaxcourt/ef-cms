import { clearAlertsAction } from '../actions/clearAlertsAction';
import { serveCourtIssuedDocumentAction } from '../actions/serveCourtIssuedDocumentAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveCourtIssuedDocumentSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
  serveCourtIssuedDocumentAction,
  unsetWaitingForResponseAction,
];
