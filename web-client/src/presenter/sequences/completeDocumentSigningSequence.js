import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { parallel } from 'cerebral';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';

export const completeDocumentSigningSequence = [
  completeDocumentSigningAction,
  parallel([setDocumentIdAction, setDocumentDetailTabAction]),
  ...createWorkItemSequence,
  clearPDFSignatureDataAction,
  navigateToCaseDetailAction,
];
