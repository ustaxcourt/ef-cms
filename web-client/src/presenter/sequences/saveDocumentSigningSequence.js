import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { getGotoAfterSigningAction } from '../actions/getGotoAfterSigningAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { parallel, state } from 'cerebral';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const saveDocumentSigningSequence = [
  clearAlertsAction,
  set(state.saveAlertsForNavigation, true),
  setWaitingForResponseAction,
  completeDocumentSigningAction,
  parallel([setDocumentIdAction, setDocumentDetailTabAction]),
  unsetWaitingForResponseAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  setAlertSuccessAction,
  getGotoAfterSigningAction,
  {
    CaseDetail: [navigateToCaseDetailAction],
    DocumentDetail: [navigateToDocumentDetailAction],
  },
];
