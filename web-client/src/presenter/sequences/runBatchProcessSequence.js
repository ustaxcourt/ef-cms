import { runBatchProcessAction } from '../actions/runBatchProcessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const runBatchProcessSequence = [
  setFormSubmittingAction,
  runBatchProcessAction,
  unsetFormSubmittingAction,
];
