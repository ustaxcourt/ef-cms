import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { gotoCaseDetailSequence } from './gotoCaseDetailSequence';

export const completeDocumentSigningSequence = [
  ...createWorkItemSequence,
  completeDocumentSigningAction,
  clearPDFSignatureDataAction,
  ...gotoCaseDetailSequence,
];
