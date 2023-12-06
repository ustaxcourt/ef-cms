import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setMessageIdAction } from '../actions/setMessageIdAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoSignOrderSequence = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  setRedirectUrlAction,
  getCaseAction,
  setCaseAction,
  setDocketEntryIdAction,
  setMessageIdAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  setSignatureNameForPdfSigningAction,
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setParentMessageIdAction,
  setupCurrentPageAction('SignOrder'),
]);
