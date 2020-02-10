import { assignSelectedWorkItemsAction } from '../actions/assignSelectedWorkItemsAction';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const assignSelectedWorkItemsSequence = showProgressSequenceDecorator([
  assignSelectedWorkItemsAction,
  ...chooseWorkQueueSequence,
]);
