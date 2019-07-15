import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';

import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setMessageIdAction } from '../actions/setMessageIdAction';

export const gotoSignPDFDocumentSequence = [
  setCurrentPageAction('Interstitial'),
  setDocumentIdAction,
  setMessageIdAction,
  getCaseAction,
  setCaseAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  setSignatureNameForPdfSigningAction,
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setCurrentPageAction('PDFSigner'),
];
