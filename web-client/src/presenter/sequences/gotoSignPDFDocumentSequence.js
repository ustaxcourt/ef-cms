import { clearFormAction } from '../actions/clearFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';

export const gotoSignPDFDocumentSequence = [
  setCurrentPageAction('Interstitial'),
  clearFormAction,
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setCurrentPageAction('PDFSigner'),
];
