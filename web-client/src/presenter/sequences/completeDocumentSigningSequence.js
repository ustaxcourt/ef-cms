import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { gotoDashboardSequence } from './gotoDashboardSequence';

export const completeDocumentSigningSequence = [
  ...createWorkItemSequence,
  completeDocumentSigningAction,
  clearPDFSignatureDataAction,
  ...gotoDashboardSequence,
];
