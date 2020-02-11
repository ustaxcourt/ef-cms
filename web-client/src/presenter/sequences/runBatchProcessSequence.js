import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { runBatchProcessAction } from '../actions/runBatchProcessAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const runBatchProcessSequence = showProgressSequenceDecorator([
  runBatchProcessAction,
  chooseWorkQueueSequence,
]);
