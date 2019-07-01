import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { gotoCaseDetailSequence } from './gotoCaseDetailSequence';

export const completeDocumentSigningSequence = [
  ...createWorkItemSequence,
  completeDocumentSigningAction,
  ...gotoCaseDetailSequence,
];
