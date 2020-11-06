import { fetchPendingItemsAction } from '../../actions/PendingItems/fetchPendingItemsAction';
import { setPendingItemsAction } from '../../actions/PendingItems/setPendingItemsAction';
import { showProgressSequenceDecorator } from '../../utilities/sequenceHelpers';

export const fetchPendingItemsSequence = showProgressSequenceDecorator([
  fetchPendingItemsAction,
  setPendingItemsAction,
]);
