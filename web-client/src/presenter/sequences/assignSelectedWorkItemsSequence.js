import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const assignSelectedWorkItemsSequence = [
  setFormSubmittingAction,
  assignSelectedWorkItemsAction,
  ...chooseWorkQueueSequence,
  unsetFormSubmittingAction,
];
