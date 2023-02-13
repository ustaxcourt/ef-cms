import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const assignSelectedWorkItemsSequence = showProgressSequenceDecorator([
  assignSelectedWorkItemsAction,
  ...chooseWorkQueueSequence,
]);
