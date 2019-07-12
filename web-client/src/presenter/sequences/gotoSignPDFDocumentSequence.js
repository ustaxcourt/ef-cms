import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';

export const gotoSignPDFDocumentSequence = [
  setCurrentPageAction('Interstitial'),
  clearPDFSignatureDataAction,
  clearFormAction,
  setSignatureNameForPdfSigningAction,
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setCurrentPageAction('PDFSigner'),
];
