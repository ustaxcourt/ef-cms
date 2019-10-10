import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { runBatchProcessAction } from '../actions/runBatchProcessAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const runBatchProcessSequence = [
  setWaitingForResponseAction,
  runBatchProcessAction,
  unsetWaitingForResponseAction,
  ...chooseWorkQueueSequence,
];
