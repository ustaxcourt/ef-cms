import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setMessageIdAction } from '../actions/setMessageIdAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';

export const gotoSignOrderSequence = [
  setCurrentPageAction('Interstitial'),
  setRedirectUrlAction,
  getCaseAction,
  setCaseAction,
  setDocumentIdAction,
  setMessageIdAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  setSignatureNameForPdfSigningAction,
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setParentMessageIdAction,
  setCurrentPageAction('SignOrder'),
];
