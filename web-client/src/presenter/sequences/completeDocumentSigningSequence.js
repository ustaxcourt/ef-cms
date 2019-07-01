import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';

export const completeDocumentSigningSequence = [
  completeDocumentSigningAction,
  clearPDFSignatureDataAction,
];
