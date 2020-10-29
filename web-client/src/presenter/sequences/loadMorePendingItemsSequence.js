import { fetchPendingItemsAction } from '../actions/PendingItems/fetchPendingItemsAction';
import { incrementPendingItemsPageAction } from '../actions/PendingItems/incrementPendingItemsPageAction';
import { setPendingItemsAction } from '../actions/PendingItems/setPendingItemsAction';

export const loadMorePendingItemsSequence = [
  incrementPendingItemsPageAction,
  fetchPendingItemsAction,
  setPendingItemsAction,
];
