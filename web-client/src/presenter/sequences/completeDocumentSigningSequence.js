import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { gotoDashboardSequence } from './gotoDashboardSequence';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';

export const completeDocumentSigningSequence = [
  completeDocumentSigningAction,
  setDocumentIdAction,
  ...createWorkItemSequence,
  clearPDFSignatureDataAction,
  ...gotoDashboardSequence,
];
