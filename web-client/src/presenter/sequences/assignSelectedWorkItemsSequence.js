import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const assignSelectedWorkItemsSequence = [
  setWaitingForResponseAction,
  assignSelectedWorkItemsAction,
  ...chooseWorkQueueSequence,
  unsetWaitingForResponseAction,
];
