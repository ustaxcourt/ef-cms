import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';

export const gotoSignPDFDocumentSequence = [
  setCurrentPageAction('Interstitial'),
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setCurrentPageAction('PDFSigner'),
];
