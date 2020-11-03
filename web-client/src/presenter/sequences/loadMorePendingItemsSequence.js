import { fetchPendingItemsAction } from '../actions/PendingItems/fetchPendingItemsAction';
import { incrementPendingItemsPageAction } from '../actions/PendingItems/incrementPendingItemsPageAction';
import { setPendingItemsAction } from '../actions/PendingItems/setPendingItemsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const loadMorePendingItemsSequence = [
  incrementPendingItemsPageAction,
  showProgressSequenceDecorator([
    fetchPendingItemsAction,
    setPendingItemsAction,
  ]),
];
