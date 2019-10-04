import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { getGotoAfterSigningAction } from '../actions/getGotoAfterSigningAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToDocumentDetailAction } from '../actions/navigateToDocumentDetailAction';
import { parallel } from 'cerebral';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const saveDocumentSigningSequence = [
  clearAlertsAction,
  setWaitingForResponseAction,
  completeDocumentSigningAction,
  parallel([setDocumentIdAction, setDocumentDetailTabAction]),
  unsetWaitingForResponseAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  getGotoAfterSigningAction,
  {
    CaseDetail: [navigateToCaseDetailAction],
    DocumentDetail: [navigateToDocumentDetailAction],
  },
];
