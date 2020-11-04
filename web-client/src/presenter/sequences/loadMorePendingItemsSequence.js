import { fetchPendingItemsSequence } from '../sequences/pending/fetchPendingItemsSequence';
import { incrementPendingItemsPageAction } from '../actions/PendingItems/incrementPendingItemsPageAction';

export const loadMorePendingItemsSequence = [
  incrementPendingItemsPageAction,
  ...fetchPendingItemsSequence,
];
