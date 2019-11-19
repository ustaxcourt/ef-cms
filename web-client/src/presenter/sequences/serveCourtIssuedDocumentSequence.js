import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { serveCourtIssuedDocumentAction } from '../actions/serveCourtIssuedDocumentAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const serveCourtIssuedDocumentSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
  serveCourtIssuedDocumentAction,
  setSaveAlertsForNavigationAction,
  setAlertSuccessAction,
  clearModalAction,
  unsetWaitingForResponseAction,
  navigateToCaseDetailAction,
];
